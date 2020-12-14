import { Injectable } from '@nestjs/common';
import Axios from 'axios';
import {
  OMDBSearchResult,
  OMDBSearchParams,
  GetOMDBSearchQueries,
} from './omdb.dto';

@Injectable()
export class OMDBService {
  private async request<TData>(params: OMDBSearchParams = {}) {
    const client = Axios.create({
      params: { apikey: '9cffdb0d' },
      baseURL: 'http://www.omdbapi.com/',
    });

    const { data } = await client.get<TData>('', { params });

    return data;
  }

  public async search(args: GetOMDBSearchQueries) {
    const result = await this.request<OMDBSearchResult>({
      t: args.title,
    });

    return this.mapResult(result);
  }

  private mapResult(omdbSearchResult: OMDBSearchResult) {
    const ratings = omdbSearchResult.Ratings?.reduce(
      (prev, { Source, Value }) => ({
        ...prev,
        ...(Source === 'Metacritic' && {
          metaCritic: Value,
        }),
        ...(Source === 'Internet Movie Database' && {
          IMDB: Value,
        }),
        ...(Source === 'Rotten Tomatoes' && {
          rottenTomatoes: Value,
        }),
      }),
      {}
    );

    return {
      ratings,
    };
  }
}
