import dayjs from 'dayjs';
import axios from 'axios';
import xmlParser from 'xml2json-light';
import { orderBy, uniq, uniqBy } from 'lodash';
import { mapSeries } from 'p-iteration';
import { Injectable, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { ParameterKey } from 'src/app.dto';
import { formatNumber } from 'src/utils/format-number';
import { sanitize } from 'src/utils/sanitize';
import { firstOf } from 'src/utils/first-promise-resolve';

import { ParamsService } from 'src/modules/params/params.service';
import { LibraryService } from 'src/modules/library/library.service';

import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';
import { TVEpisodeDAO } from 'src/entities/dao/tvepisode.dao';
import { Quality } from 'src/entities/quality.entity';
import { Tag } from 'src/entities/tag.entity';

import { JackettResult, JackettIndexer } from './jackett.dto';
import { Entertainment } from '../tmdb/tmdb.dto';

@Injectable()
export class JackettService {
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly paramsService: ParamsService,
    private readonly libraryService: LibraryService,
    private readonly tvSeasonDAO: TVSeasonDAO,
    private readonly tvEpisodeDAO: TVEpisodeDAO
  ) {
    this.logger = logger.child({ context: 'JackettService' });
  }

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

  private async xmlRequest<TData>(path: string, params: Record<string, any>) {
    const { data: xml } = await this.request(path, params);
    return xmlParser.xml2json(xml) as TData;
  }

  public async getConfiguredIndexers() {
    const { indexers } = await this.xmlRequest<{
      indexers: {
        indexer: JackettIndexer[] | JackettIndexer;
      };
    }>('/results/torznab', { t: 'indexers', configured: true });
    return Array.isArray(indexers.indexer)
      ? indexers.indexer
      : [indexers.indexer];
  }

  public async searchMovie(movieId: number) {
    this.logger.info('search movie', { movieId });

    const maxSize = await this.paramsService.getNumber(
      ParameterKey.MAX_MOVIE_DOWNLOAD_SIZE
    );

    const movie = await this.libraryService.getMovie(movieId);
    const queries = [
      `${movie.title} ${dayjs(movie.releaseDate).format('YYYY')}`,
      `${movie.originalTitle} ${dayjs(movie.releaseDate).format('YYYY')}`,
    ];

    return this.search(queries, { maxSize, type: Entertainment.Movie });
  }

  public async searchSeason(seasonId: number) {
    this.logger.info('search tv season', { seasonId });

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

    const titles = [tvShow.title, enTVShow.title];
    if (this.canSearchOriginalTitle(tvShow.originCountry)) {
      titles.push(tvShow.originalTitle);
    }

    const queries = uniq(titles)
      .map((title) => [
        `${title} S${formatNumber(tvSeason.seasonNumber)}`,
        `${title} Season ${formatNumber(tvSeason.seasonNumber)}`,
        `${title} Saison ${formatNumber(tvSeason.seasonNumber)}`,
      ])
      .flat();

    return this.search(queries, {
      maxSize: maxSize * tvSeason.episodes.length,
      isSeason: true,
      type: Entertainment.TvShow,
    });
  }

  public async searchEpisode(episodeId: number) {
    this.logger.info('search tv episode', { episodeId });

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

    const titles = [tvShow.title, enTVShow.title];
    if (this.canSearchOriginalTitle(tvShow.originCountry)) {
      titles.push(tvShow.originalTitle);
    }

    const queries = uniq(titles)
      .map((title) => [
        `${title} S${s}E${e}`,
        `${title} Season ${s} Episode ${e}`,
        `${title} Saison ${s} Episode ${e}`,
      ])
      .flat();

    return this.search(queries, { maxSize, type: Entertainment.TvShow });
  }

  public async search(
    queries: string[],
    opts: {
      maxSize?: number;
      isSeason?: boolean;
      withoutFilter?: boolean;
      type?: Entertainment;
    }
  ) {
    const indexers = await this.getConfiguredIndexers();
    const noResultsError = 'NO_RESULTS';
    try {
      const results = await firstOf(
        indexers.map((indexer) =>
          this.searchIndexer({ ...opts, queries, indexer }).then((rows) =>
            rows.length > 0
              ? Promise.resolve(rows)
              : Promise.reject(new Error(noResultsError))
          )
        )
      );
      return results;
    } catch (error) {
      // return empty results array, let application continue it's lifecycle
      if (Array.isArray(error) && error[0].message === noResultsError) {
        return [];
      }

      // its a non handled error, throw
      // throw first non handled error from promises
      if (Array.isArray(error)) {
        throw error[0];
      }

      throw error;
    }
  }

  public async searchIndexer({
    queries,
    indexer,
    maxSize = Infinity,
    isSeason = false,
    withoutFilter = false,
    type,
  }: {
    queries: string[];
    indexer?: JackettIndexer;
    maxSize?: number;
    isSeason?: boolean;
    withoutFilter?: boolean;
    type?: Entertainment;
  }) {
    const qualityParams = await this.paramsService.getQualities(type);
    const preferredTags = await this.paramsService.getTags();

    const rawResults = await mapSeries(uniq(queries), async (query) => {
      const normalizedQuery = sanitize(query);
      this.logger.info('search torrents with query', {
        indexer: indexer?.title || 'all',
        query: normalizedQuery,
      });

      const { data } = await this.request<{ Results: JackettResult[] }>(
        '/results',
        {
          Query: normalizedQuery,
          Category: [2000, 5000, 5070],
          Tracker: indexer ? [indexer.id] : undefined,
          _: Number(new Date()),
        }
      );

      return data.Results;
    });

    this.logger.info(`found ${rawResults.flat().length} potential results`);
    const results = uniqBy(rawResults.flat(), 'Guid')
      .filter((result) => result.Link || result.MagnetUri)
      .map((result) =>
        this.formatSearchResult({ result, qualityParams, preferredTags })
      )
      .filter((result) => {
        if (withoutFilter) return true;

        const hasAcceptableSize = result.size < maxSize;
        const hasSeeders = result.seeders >= 5 && result.seeders > result.peers;
        const hasTag = result.tag.score > 0;

        if (isSeason) {
          const isEpisode = result.normalizedTitleParts.some((titlePart) =>
            titlePart.match(/e\d+|episode|episode\d+|ep|ep\d+/)
          );
          return hasAcceptableSize && hasSeeders && !isEpisode;
        }

        return hasAcceptableSize && hasSeeders && hasTag;
      });

    this.logger.info(`found ${results.length} downloadable results`);

    return orderBy(
      results,
      ['tag.score', 'quality.score', 'seeders'],
      ['desc', 'desc', 'desc']
    );
  }

  private formatSearchResult = ({
    result,
    qualityParams,
    preferredTags,
  }: {
    result: JackettResult;
    qualityParams: Quality[];
    preferredTags: Tag[];
  }) => {
    const normalizedTitle = sanitize(result.Title);
    const normalizedTitleParts = normalizedTitle
      .split(' ')
      .filter((str) => str && str.trim());

    return {
      normalizedTitle,
      normalizedTitleParts,
      id: result.Guid,
      title: result.Title,
      quality: this.parseQuality(normalizedTitleParts, qualityParams),
      size: result.Size,
      seeders: result.Seeders,
      peers: result.Peers,
      link: result.Guid,
      // we filter out results wihtout link or magnet uri before
      // there will always be a download link
      downloadLink: (result.MagnetUri || result.Link) as string,
      tag: this.parseTag(normalizedTitleParts, preferredTags),
      publishDate: result.PublishDate,
    };
  };

  private parseTag(normalizedTitle: string[], preferredTags: Tag[]) {
    const tagMatch = preferredTags.find((tag) =>
      normalizedTitle.find((part) => part === tag.name.toLowerCase())
    );

    // we set score to 1 when there's not tag set
    // like this all results will be treated as potential result
    const unknownScore = preferredTags.length > 0 ? 0 : 1;

    return tagMatch
      ? { label: tagMatch.name, score: tagMatch.score }
      : { label: 'unknown', score: unknownScore };
  }

  private parseQuality(normalizedTitle: string[], qualityParams: Quality[]) {
    const qualityMatch = qualityParams.find((quality) =>
      quality.match.some((keyword) =>
        normalizedTitle.find((part) => part === keyword.toLowerCase())
      )
    );

    return qualityMatch
      ? { label: qualityMatch.name, score: qualityMatch.score }
      : { label: 'unknown', score: 0 };
  }

  private canSearchOriginalTitle(originalCountries: string[]) {
    // original titles may be hard to search on occidental trackers
    // they may return incorrect torrent to download
    return !originalCountries.some((country) =>
      ['CN', 'CH', 'JP'].includes(country)
    );
  }
}
