/* eslint @typescript-eslint/camelcase:off */

import axios, { AxiosInstance } from 'axios';
import { Injectable } from '@nestjs/common';

import { ParameterKey } from 'src/app.dto';
import { ParamsService } from 'src/modules/params/params.service';

import { TMDBMovie, TMDBTVShow } from './tmdb.dto';

@Injectable()
export class TMDBService {
  private client!: AxiosInstance;

  public constructor(private readonly paramsService: ParamsService) {
    this.initializeClient();
  }

  private async initializeClient() {
    const apiKey = await this.paramsService.get(ParameterKey.TMDB_API_KEY);
    const language = await this.paramsService.get(ParameterKey.LANGUAGE);

    this.client = axios.create({
      params: { api_key: apiKey, language },
      baseURL: 'https://api.themoviedb.org/3/',
    });
  }

  public async getMovie(id: number) {
    const { data } = await this.client.get(`/movie/${id}`);
    return data as TMDBMovie;
  }

  public async search(query: string) {
    const [movies, tvShows] = await Promise.all([
      this.client
        .get<{ results: TMDBMovie[] }>('/search/movie', { params: { query } })
        .then(({ data }) => data.results.map(this.mapMovie)),
      this.client
        .get<{ results: TMDBTVShow[] }>('/search/tv', { params: { query } })
        .then(({ data }) => data.results.map(this.mapTVShow)),
    ]);
    return { movies, tvShows };
  }

  public async getPopular() {
    const region = await this.paramsService.get(ParameterKey.REGION);
    const [movies, tvShows] = await Promise.all([
      this.client
        .get<{ results: TMDBMovie[] }>('/movie/popular', { params: { region } })
        .then(({ data }) => data.results.map(this.mapMovie)),
      this.client
        .get<{ results: TMDBTVShow[] }>('/tv/popular', { params: { region } })
        .then(({ data }) => data.results.map(this.mapTVShow)),
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
