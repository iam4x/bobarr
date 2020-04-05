import dayjs from 'dayjs';
import axios, { AxiosInstance } from 'axios';
import { orderBy, uniq } from 'lodash';
import { mapSeries } from 'p-iteration';
import { Injectable } from '@nestjs/common';

import { ParameterKey } from 'src/app.dto';
import { ParamsService } from 'src/modules/params/params.service';
import { LibraryService } from 'src/modules/library/library.service';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';

import { JackettResult } from './jackett.dto';
import { formatNumber } from 'src/utils/format-number';

@Injectable()
export class JackettService {
  private client!: AxiosInstance;

  public constructor(
    private readonly paramsService: ParamsService,
    private readonly libraryService: LibraryService,
    private readonly tvSeasonDAO: TVSeasonDAO
  ) {
    this.initializeClient();
  }

  private async initializeClient() {
    const jackettApiKey = await this.paramsService.get(
      ParameterKey.JACKETT_API_KEY
    );
    this.client = axios.create({
      baseURL: 'http://jackett:9117/api/v2.0/indexers/all',
      params: { apikey: jackettApiKey },
    });
  }

  public async searchMovie(movieId: number) {
    const maxSize = await this.paramsService.getNumber(
      ParameterKey.MAX_MOVIE_DOWNLOAD_SIZE
    );

    const movie = await this.libraryService.getMovie(movieId);
    const queries = [
      `${movie.title} ${dayjs(movie.releaseDate).format('YYYY')}`,
      `${movie.originalTitle} ${dayjs(movie.releaseDate).format('YYYY')}`,
    ];

    return this.search(queries, { maxSize });
  }

  public async searchSeason(seasonId: number) {
    const maxSize = await this.paramsService.getNumber(
      ParameterKey.MAX_TVSHOW_EPISODE_DOWNLOAD_SIZE
    );

    const tvSeason = await this.tvSeasonDAO.findOneOrFail({
      where: { id: seasonId },
      relations: ['tvShow', 'episodes'],
    });

    const queries = [
      `${tvSeason.tvShow.title} S${formatNumber(tvSeason.seasonNumber)}`,
      `${tvSeason.tvShow.title} Season ${formatNumber(tvSeason.seasonNumber)}`,
      `${tvSeason.tvShow.title} Season ${tvSeason.seasonNumber}`,
      `${tvSeason.tvShow.title} Saison ${formatNumber(tvSeason.seasonNumber)}`,
      `${tvSeason.tvShow.title} Saison ${tvSeason.seasonNumber}`,
    ];

    return this.search(queries, {
      maxSize: maxSize * tvSeason.episodes.length,
      exclude: /e\d+|episode/,
    });
  }

  private async search(
    queries: string[],
    { maxSize, exclude }: { maxSize: number; exclude?: RegExp }
  ) {
    const preferredTags = await this.paramsService.getList(
      ParameterKey.PREFERRED_TAGS
    );

    const rawResults = await mapSeries(uniq(queries), async (query) => {
      const normalizedQuery = query
        .toLowerCase()
        .replace(/,/g, ' ')
        .replace(/\./g, ' ')
        .replace(/-/g, ' ')
        .replace(/\(|\)/g, '')
        .replace(/\[|\]/g, '')
        .replace(/[az]'/g, ' ')
        .replace(/:/g, ' ');

      const { data } = await this.client.get<{
        Results: JackettResult[];
      }>('/results', {
        params: {
          Query: normalizedQuery,
          Category: [2000, 5000, 5070],
          _: Number(new Date()),
        },
      });

      return data.Results;
    });

    const sizeLimitAndSeeded = rawResults.flat().filter(
      (result) =>
        result.Size < maxSize && // maxSize
        result.Seeders >= 10 && // has seeders
        (exclude ? !result.Title.toLowerCase().match(exclude) : true) // its not excluded
    );

    const withTags = sizeLimitAndSeeded.map(this.formatSearchResult);
    const withPreferredTags = withTags.filter(
      (result) =>
        preferredTags.includes(result.tag.label) &&
        !result.title.toLowerCase().includes('3d')
    );

    return orderBy(
      withPreferredTags.length > 0 ? withPreferredTags : withTags,
      withPreferredTags.length > 0
        ? ['tag.score', 'quality.score', 'seeders']
        : ['quality.score', 'seeders'],
      withPreferredTags.length > 0 ? ['desc', 'desc', 'desc'] : ['desc', 'desc']
    );
  }

  private formatSearchResult = (result: JackettResult) => {
    const normalizedTitle = result.Title.toLowerCase()
      .replace(/,/g, ' ')
      .replace(/\./g, ' ')
      .replace(/-/g, ' ')
      .replace(/\(|\)/g, '')
      .replace(/\[|\]/g, '')
      .split(' ');

    return {
      title: result.Title,
      quality: this.parseQuality(normalizedTitle),
      size: result.Size,
      seeders: result.Seeders,
      peers: result.Peers,
      link: result.Guid,
      downloadLink: result.Link,
      tag: this.parseTag(normalizedTitle),
    };
  };

  private parseTag(normalizedTitle: string[]) {
    const match = (keywords: string[]) =>
      keywords.some((keyword) =>
        normalizedTitle.find((part) => part === keyword)
      );

    if (match(['multi'])) return { label: 'multi', score: 2 };
    if (match(['vost', 'subfrench'])) return { label: 'vost', score: 1 };
    return { label: 'unknown', score: 0 };
  }

  private parseQuality(normalizedTitle: string[]) {
    const match = (keywords: string[]) =>
      keywords.some((keyword) =>
        normalizedTitle.find((part) => part === keyword)
      );

    if (match(['uhd', '4k'])) return { label: '4k', score: 5 };
    if (match(['2160', '2160p'])) return { label: '2160p', score: 4 };
    if (match(['1440', '1440p'])) return { label: '1440p', score: 3 };
    if (match(['1080', '1080p'])) return { label: '1080p', score: 2 };
    if (match(['720', '720p'])) return { label: '720p', score: 1 };
    return { label: 'unknown', score: 0 };
  }
}
