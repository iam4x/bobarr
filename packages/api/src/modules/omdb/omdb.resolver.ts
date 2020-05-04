import { Resolver, Args, Query } from '@nestjs/graphql';

import { OMDBService } from './omdb.service';
import { GetOMDBSearchQueries, OMDBInfo } from './omdb.dto';

@Resolver()
export class OMDBResolver {
  public constructor(private readonly omdbService: OMDBService) {}

  @Query((_returns) => OMDBInfo)
  public omdbSearch(@Args() args: GetOMDBSearchQueries) {
    return this.omdbService.search(args);
  }
}
