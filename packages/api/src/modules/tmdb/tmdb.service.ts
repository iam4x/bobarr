/* eslint @typescript-eslint/camelcase:off */

import axios from 'axios';
import { Injectable, Inject } from '@nestjs/common';
import { map, reduce } from 'p-iteration';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { orderBy } from 'lodash';

import { ParameterKey } from 'src/app.dto';
import { recursiveCamelCase } from 'src/utils/recursive-camel-case';
import { ParamsService } from 'src/modules/params/params.service';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';
import { TVShowDAO } from 'src/entities/dao/tvshow.dao';
import { MovieDAO } from 'src/entities/dao/movie.dao';

import {
  TMDBMovie,
  TMDBTVShow,
  TMDBFormattedTVSeason,
  TMDBTVEpisode,
  TMDBGenres,
  TMDBLanguage,
  GetDiscoverQueries,
  TMDBPagination,
  Entertainment,
  TMDBRequestParams,
} from './tmdb.dto';

@Injectable()
export class TMDBService {
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly paramsService: ParamsService,
    private readonly tvSeasonDAO: TVSeasonDAO,
    private readonly tvShowDAO: TVShowDAO,
    private readonly movieDAO: MovieDAO
  ) {
    this.logger = logger.child({ context: 'TMDBService' });
  }

  private async request<TData>(path: string, params: TMDBRequestParams = {}) {
    const apiKey = await this.paramsService.get(ParameterKey.TMDB_API_KEY);
    const language = await this.paramsService.get(ParameterKey.LANGUAGE);

    const client = axios.create({
      params: { api_key: apiKey, language },
      baseURL: 'https://api.themoviedb.org/3/',
    });

    return client
      .get<TData>(path, { params })
      .then(({ data }) => data);
  }

  public getMovie(movieTMDBId: number) {
    return this.request<TMDBMovie>(`/movie/${movieTMDBId}`);
  }

  public getTVShow(tvShowTMDBId: number, params?: { language: string }) {
    return this.request<TMDBTVShow>(`/tv/${tvShowTMDBId}`, params);
  }

  public async getEnglishTVShowName(tvShowTMDBId: number) {
    const { name } = await this.request<TMDBTVShow>(`/tv/${tvShowTMDBId}`, {
      language: 'en',
    });
    return name;
  }

  public getTVEpisode(
    tvShowTMDBId: number,
    seasonNumber: number,
    episodeNumber: number
  ) {
    return this.request<TMDBTVEpisode>(
      `/tv/${tvShowTMDBId}/season/${seasonNumber}/episode/${episodeNumber}`
    );
  }

  public async getTVShowSeasons(tvShowTMDBId: number) {
    const tvShow = await this.getTVShow(tvShowTMDBId);
    return map(tvShow.seasons, async (season) =>
      recursiveCamelCase<TMDBFormattedTVSeason>({
        ...season,
        inLibrary: await this.tvSeasonDAO.inLibrary(
          tvShowTMDBId,
          season.season_number
        ),
      })
    );
  }

  public async searchMovie(query: string, params = {}) {
    this.logger.info('start search movie', { query, params });

    const data = await this.request<{ results: TMDBMovie[] }>('/search/movie', {
      query,
      ...params,
    });

    const results = data.results.map(this.mapMovie);
    this.logger.info(`found ${results.length} movies`, { query, params });

    return results;
  }

  public async searchTVShow(query: string, params = {}) {
    this.logger.info('start search tvshow', { query, params });

    const data = await this.request<{ results: TMDBTVShow[] }>('/search/tv', {
      query,
      ...params,
    });

    const results = data.results.map(this.mapTVShow);
    this.logger.info(`found ${results.length} tvshows`);

    return results;
  }

  public async search(query: string) {
    return {
      movies: await this.searchMovie(query),
      tvShows: await this.searchTVShow(query),
    };
  }

  public async getPopular() {
    this.logger.info('start get popular');

    const region = await this.paramsService.get(ParameterKey.REGION);
    const [movies, tvShows] = await Promise.all([
      this.request<{ results: TMDBMovie[] }>('/movie/popular', {
        region,
      }).then(({ results }) => results.map(this.mapMovie)),
      this.request<{ results: TMDBTVShow[] }>('/tv/popular', {
        region,
      }).then(({ results }) => results.map(this.mapTVShow)),
    ]);

    this.logger.info('finish get popular');

    return { movies, tvShows };
  }

  public async getRecommended(type: 'tvshow' | 'movie') {
    this.logger.info(`start get recommended ${type}s`);

    const url =
      type === 'tvshow'
        ? (id: number) => `/tv/${id}/recommendations`
        : (id: number) => `/movie/${id}/recommendations`;

    const entities =
      type === 'tvshow'
        ? await this.tvShowDAO.find()
        : await this.movieDAO.find();

    const allSimilars = await reduce<any, any[]>(
      entities,
      async (results, entity) => {
        const data = await this.request<{
          results: Array<TMDBTVShow | TMDBMovie>;
        }>(url(entity.tmdbId));

        const similarsWithoutAlreadyInLibrary = data.results.filter(
          (a) => !entities.some((b: any) => a.id === b.tmdbId)
        );

        const mergedResults = [...results, ...similarsWithoutAlreadyInLibrary];
        const mergedResultsWithCount = mergedResults.reduce(
          (merged: Array<Record<string, any>>, curr) => {
            // if already found as recommendation increment count
            if (merged.some((m) => m.id === curr.id)) {
              return merged.map((m) => {
                const count = m.id === curr.id ? m.count + 1 : m.count;
                return { ...m, count };
              });
            }

            // new recommendation
            return [...merged, { ...curr, count: 1 }];
          },
          []
        );

        return mergedResultsWithCount;
      },
      []
    );

    this.logger.info(`found ${allSimilars.length} recommendations`);
    this.logger.info(`finish get recommended ${type}s`);

    return orderBy(allSimilars, ['count', 'popularity'], ['desc', 'desc'])
      .filter((_row, index) => index <= 50)
      .map(type === 'movie' ? this.mapMovie : this.mapTVShow);
  }

  public async discover(args: GetDiscoverQueries) {
    this.logger.info('start discovery filter', args);

    const {
      primaryReleaseYear,
      entertainment,
      originLanguage,
      score,
      genres,
      page,
    } = args;

    const normalizedArgs = {
      'vote_count.gte': 50,
      with_genres: genres?.join(','),
      with_original_language: originLanguage,
      'vote_average.gte': score && score / 10,
      ...(Entertainment.Movie && {
        primary_release_year: Number(primaryReleaseYear),
      }),
      ...(Entertainment.TvShow && {
        first_air_date_year: Number(primaryReleaseYear),
      }),
      page,
    };

    this.logger.info('finish discovery filter');
    if (entertainment === Entertainment.Movie) {
      return await this.discoverMovie(normalizedArgs);
    }

    return await this.discoverTvShow(normalizedArgs);
  }

  private async discoverMovie(args: TMDBRequestParams) {
    const { results } = await this.request<{ results: TMDBMovie[] }>(
      `/discover/movie`,
      args
    );

    const {
      page: pageNumber,
      total_pages,
      total_results,
      results,
    } = TMDBResults;

    return {
      page: pageNumber,
      totalResults: total_results,
      totalPages: total_pages,
      results: results.map(this.mapMovie),
    };

    // return results.results.map(this.mapMovie);
  }

  private async discoverTvShow(args: TMDBRequestParams) {
    const { results } = await this.request<{ results: TMDBTVShow[] }>(
      `/discover/tv`,
      args
    );

    return results.map(this.mapTVShow);
  }

  public async getLanguages() {
    this.logger.info('start get TMDB languages');

    const results = await this.request<TMDBLanguage[]>(
      '/configuration/languages'
    );

    this.logger.info('finish get TMDB languages');

    return results.map(({ iso_639_1: code, english_name: language }) => ({
      code,
      language,
    }));
  }

  public async getGenres() {
    this.logger.info('start get TMDB genres');

    const [movieGenres, tvShowGenres] = await Promise.all([
      this.request<{ genres: TMDBGenres[] }>('/genre/movie/list'),
      this.request<{ genres: TMDBGenres[] }>('/genre/tv/list'),
    ]);

    this.logger.info('finish get TMDB genres');

    return {
      movieGenres: movieGenres.genres,
      tvShowGenres: tvShowGenres.genres,
    };
  }

  public mapMovie(result: TMDBMovie) {
    return {
      id: result.id,
      tmdbId: result.id,
      title: result.title,
      overview: result.overview,
      runtime: result.runtime,
      originalTitle: result.original_title,
      originCountry: result.original_language,
      releaseDate: result.release_date,
      posterPath: result.poster_path,
      voteAverage: result.vote_average,
    };
  }

  public mapTVShow(result: TMDBTVShow) {
    return {
      id: result.id,
      tmdbId: result.id,
      title: result.name,
      overview: result.overview,
      originalTitle: result.original_name,
      originCountry: result.origin_country,
      releaseDate: result.first_air_date,
      posterPath: result.poster_path,
      voteAverage: result.vote_average,
    };
  }
}
