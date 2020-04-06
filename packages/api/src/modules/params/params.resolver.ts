import {
  Resolver,
  ObjectType,
  Field,
  Query,
  Mutation,
  Args,
} from '@nestjs/graphql';

import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { ParameterDAO } from 'src/entities/dao/parameter.dao';
import { GraphQLCommonResponse, ParameterKey } from 'src/app.dto';

@ObjectType()
class ParamsHash {
  @Field() public region!: string;
  @Field() public language!: string;
  @Field() public tmdb_api_key!: string;
  @Field() public jackett_api_key!: string;
  @Field() public max_movie_download_size!: string;
  @Field() public max_tvshow_episode_download_size!: string;
  @Field() public preferred_tags!: string;
}

@Resolver()
export class ParamsResolver {
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly parameterDAO: ParameterDAO
  ) {
    this.logger = logger.child({ context: 'ParamsResolver' });
  }

  @Query((_returns) => ParamsHash)
  public async getParams() {
    const results = await this.parameterDAO.find({ order: { key: 'ASC' } });
    return Object.fromEntries(results.map((param) => [param.key, param.value]));
  }

  @Mutation((_returns) => GraphQLCommonResponse)
  public async updateParam(
    @Args('key', { type: () => ParameterKey }) key: ParameterKey,
    @Args('value') value: string
  ) {
    const param = await this.parameterDAO.findOrCreate({ key, value });
    await this.parameterDAO.save({ id: param.id, value });
    this.logger.info('param updated', { key, value });
    return { success: true, message: `PARAM_${key}_CORRECTLY_UPDATED` };
  }
}
