/* eslint @typescript-eslint/camelcase:off */

import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { map } from 'p-iteration';

import { ParameterKey } from 'src/app.dto';
import { recursiveCamelCase } from 'src/utils/recursive-camel-case';
import { ParamsService } from 'src/modules/params/params.service';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';

import { TMDBMovie, TMDBTVShow, TMDBTVSeason } from './tmdb.dto';

@Injectable()
export class TMDBService {
  public constructor(
    private readonly paramsService: ParamsService,
    private readonly tvSeasonDAO: TVSeasonDAO
  ) {}

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

    return client.get<TData>(path, { params });
  }

  public async getMovie(movieTMDBId: number) {
    const { data } = await this.request<TMDBMovie>(`/movie/${movieTMDBId}`);
    return data;
  }

  public async getTVShow(tvShowTMDBId: number, params?: { language: string }) {
    const { data } = await this.request<TMDBTVShow>(
      `/tv/${tvShowTMDBId}`,
      params
    );
    return data;
  }

  public async getEnglishTVShowName(tvShowTMDBId: number) {
    const { data } = await this.request<TMDBTVShow>(`/tv/${tvShowTMDBId}`, {
      language: 'en',
    });
    return data.name;
  }

  public async getTVShowSeasons(tvShowTMDBId: number) {
    const tvShow = await this.getTVShow(tvShowTMDBId);
    return map(tvShow.seasons, async (season) =>
      recursiveCamelCase<TMDBTVSeason>({
        ...season,
        inLibrary: await this.tvSeasonDAO.inLibrary(
          tvShowTMDBId,
          season.season_number
        ),
      })
    );
  }

  public async search(query: string) {
    const [movies, tvShows] = await Promise.all([
      this.request<{ results: TMDBMovie[] }>('/search/movie', {
        query,
      }).then(({ data }) => data.results.map(this.mapMovie)),
      this.request<{ results: TMDBTVShow[] }>('/search/tv', {
        query,
      }).then(({ data }) => data.results.map(this.mapTVShow)),
    ]);
    return { movies, tvShows };
  }

  public async getPopular() {
    const region = await this.paramsService.get(ParameterKey.REGION);
    const [movies, tvShows] = await Promise.all([
      this.request<{ results: TMDBMovie[] }>('/movie/popular', {
        region,
      }).then(({ data }) => data.results.map(this.mapMovie)),
      this.request<{ results: TMDBTVShow[] }>('/tv/popular', {
        region,
      }).then(({ data }) => data.results.map(this.mapTVShow)),
    ]);
    return { movies, tvShows };
  }

  private mapMovie(result: TMDBMovie) {
    return {
      id: result.id,
      tmdbId: result.id,
      title: result.title,
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
      releaseDate: result.first_air_date,
      posterPath: result.poster_path,
      voteAverage: result.vote_average,
    };
  }
}
