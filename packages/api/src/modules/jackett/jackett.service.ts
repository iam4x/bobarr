import dayjs from 'dayjs';
import axios from 'axios';
import { orderBy, uniq, uniqBy } from 'lodash';
import { mapSeries } from 'p-iteration';
import { Injectable } from '@nestjs/common';

import { ParameterKey } from 'src/app.dto';
import { formatNumber } from 'src/utils/format-number';

import { ParamsService } from 'src/modules/params/params.service';
import { LibraryService } from 'src/modules/library/library.service';

import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';
import { TVEpisodeDAO } from 'src/entities/dao/tvepisode.dao';

import { JackettResult } from './jackett.dto';

@Injectable()
export class JackettService {
  public constructor(
    private readonly paramsService: ParamsService,
    private readonly libraryService: LibraryService,
    private readonly tvSeasonDAO: TVSeasonDAO,
    private readonly tvEpisodeDAO: TVEpisodeDAO
  ) {}

  private async request<TData>(path: string, params: Record<string, any>) {
    const jackettApiKey = await this.paramsService.get(
      ParameterKey.JACKETT_API_KEY
    );

    const client = axios.create({
      baseURL: 'http://jackett:9117/api/v2.0/indexers/all',
      params: { apikey: jackettApiKey },
    });

    return client.get<TData>(path, { params });
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

    const tvShow = await this.libraryService.getTVShow(tvSeason.tvShow.id);
    const enTVShow = await this.libraryService.getTVShow(tvSeason.tvShow.id, {
      language: 'en',
    });

    const queries = uniq([tvShow.title, tvShow.originalTitle, enTVShow.title])
      .map((title) => [
        `${title} S${formatNumber(tvSeason.seasonNumber)}`,
        `${title} Season ${formatNumber(tvSeason.seasonNumber)}`,
        `${title} Saison ${formatNumber(tvSeason.seasonNumber)}`,
      ])
      .flat();

    return this.search(queries, {
      maxSize: maxSize * tvSeason.episodes.length,
      isSeason: true,
    });
  }

  public async searchEpisode(episodeId: number) {
    const maxSize = await this.paramsService.getNumber(
      ParameterKey.MAX_TVSHOW_EPISODE_DOWNLOAD_SIZE
    );

    const tvEpisode = await this.tvEpisodeDAO.findOneOrFail({
      where: { id: episodeId },
      relations: ['tvShow'],
    });

    const tvShow = await this.libraryService.getTVShow(tvEpisode.tvShow.id);
    const enTVShow = await this.libraryService.getTVShow(tvEpisode.tvShow.id, {
      language: 'en',
    });

    const s = formatNumber(tvEpisode.seasonNumber);
    const e = formatNumber(tvEpisode.episodeNumber);

    const queries = uniq([tvShow.title, tvShow.originalTitle, enTVShow.title])
      .map((title) => [
        `${title} S${s}E${e}`,
        `${title} Season ${s} Episode ${e}`,
        `${title} Saison ${s} Episode ${e}`,
      ])
      .flat();

    return this.search(queries, { maxSize });
  }

  private async search(
    queries: string[],
    { maxSize, isSeason }: { maxSize: number; isSeason?: boolean }
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

      const { data } = await this.request<{ Results: JackettResult[] }>(
        '/results',
        {
          Query: normalizedQuery,
          Category: [2000, 5000, 5070],
          _: Number(new Date()),
        }
      );

      return data.Results;
    });

    const results = uniqBy(rawResults.flat(), 'Guid')
      .map(this.formatSearchResult)
      .filter(
        (result) =>
          // maxSize allowed
          result.size < maxSize &&
          // has at least 10 seeders
          result.seeders >= 10 &&
          // if tv season searched, filter out results with 'episode' in name
          (!isSeason ||
            !result.normalizedTitle.some((titlePart) =>
              titlePart.match(/e\d+|episode|episode\d+|ep|ep\d+/)
            ))
      );

    const withPreferredTags = results.filter(
      (result) =>
        preferredTags.includes(result.tag.label) &&
        !result.normalizedTitle.some((titlePart) => titlePart === '3d')
    );

    if (withPreferredTags.length > 0) {
      return orderBy(
        withPreferredTags,
        ['tag.score', 'quality.score', 'seeders'],
        ['desc', 'desc', 'desc']
      );
    }

    return orderBy(results, ['quality.score', 'seeders'], ['desc', 'desc']);
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
      normalizedTitle,
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
    if (match(['vost', 'subfrench', 'vostfr'])) {
      return { label: 'vost', score: 1 };
    }

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
