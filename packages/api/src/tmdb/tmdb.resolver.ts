import { Resolver, Args, Query } from '@nestjs/graphql';

import { TMDBService } from './tmdb.service';
import { TMDBSearchResults } from './tmdb.dto';

@Resolver()
export class TMDBResolver {
  public constructor(private readonly tmdbService: TMDBService) {}

  @Query((_returns) => TMDBSearchResults)
  public search(@Args('query') query: string) {
    return this.tmdbService.search(query);
  }

  @Query((_returns) => TMDBSearchResults)
  public getPopular() {
    return this.tmdbService.getPopular();
  }
}
