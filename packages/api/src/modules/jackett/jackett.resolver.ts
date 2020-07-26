import { Resolver, Args, Query } from '@nestjs/graphql';

import { JackettService } from './jackett.service';
import { JackettFormattedResult } from './jackett.dto';

@Resolver()
export class JackettResolver {
  public constructor(private readonly jacketService: JackettService) {}

  @Query((_returns) => [JackettFormattedResult])
  public async searchJackett(@Args('query') query: string) {
    const results = await this.jacketService.search([query], {
      withoutFilter: true,
    });

    return results.map((result) => ({
      ...result,
      tag: result.tag.label,
      tagScore: result.tag.score,
      quality: result.quality.label,
      qualityScore: result.quality.score,
    }));
  }
}
