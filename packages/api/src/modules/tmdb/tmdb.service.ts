/* eslint @typescript-eslint/camelcase:off */

import axios from 'axios';
import { Injectable, Inject } from '@nestjs/common';
import { map } from 'p-iteration';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { ParameterKey } from 'src/app.dto';
import { recursiveCamelCase } from 'src/utils/recursive-camel-case';
import { ParamsService } from 'src/modules/params/params.service';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';

import {
  TMDBMovie,
  TMDBTVShow,
  TMDBFormattedTVSeason,
  TMDBTVEpisode,
} from './tmdb.dto';

@Injectable()
export class TMDBService {
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly paramsService: ParamsService,
    private readonly tvSeasonDAO: TVSeasonDAO
  ) {
    this.logger = logger.child({ context: 'TMDBService' });
  }

  private async request<TData>(
    path: string,
    params: {
      query?: string;
      language?: string;
      region?: string;
    } = {}
  ) {
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

  private mapMovie(result: TMDBMovie) {
    return {
      id: result.id,
      tmdbId: result.id,
      title: result.title,
      originalTitle: result.original_title,
      releaseDate: result.release_date,
      posterPath: result.poster_path,
      voteAverage: result.vote_average,
    };
  }

  private mapTVShow(result: TMDBTVShow) {
    return {
      id: result.id,
      tmdbId: result.id,
      title: result.name,
      originalTitle: result.original_name,
      releaseDate: result.first_air_date,
      posterPath: result.poster_path,
      voteAverage: result.vote_average,
    };
  }
}
