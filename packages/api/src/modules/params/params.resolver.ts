import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { map } from 'p-iteration';

import { GraphQLCommonResponse, ParameterKey } from 'src/app.dto';

import { ParameterDAO } from 'src/entities/dao/parameter.dao';
import { QualityDAO } from 'src/entities/dao/quality.dao';
import { Tag } from 'src/entities/tag.entity';
import { Quality } from 'src/entities/quality.entity';

import { ParamsService } from './params.service';

import {
  ParamsHash,
  UpdateParamsInput,
  TagInput,
  QualityInput,
} from './params.dto';
import { Entertainment } from '../tmdb/tmdb.dto';

@Resolver()
export class ParamsResolver {
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly paramsService: ParamsService,
    private readonly parameterDAO: ParameterDAO,
    private readonly qualityDAO: QualityDAO
  ) {
    this.logger = logger.child({ context: 'ParamsResolver' });
  }

  @Query((_returns) => [Quality])
  public getQualityParams(
    @Args('type', { type: () => Entertainment })
    type: Entertainment = Entertainment.Movie
  ) {
    return this.paramsService.getQualities(type);
  }

  @Mutation((_returns) => GraphQLCommonResponse)
  public async saveQualityParams(
    @Args('qualities', { type: () => [QualityInput] })
    qualities: QualityInput[]
  ) {
    await this.qualityDAO.save(qualities);
    return { success: true, message: 'QUALITY_PARAMS_UPDATED' };
  }

  @Query((_returns) => [Tag])
  public getTags() {
    return this.paramsService.getTags();
  }

  @Mutation((_returns) => GraphQLCommonResponse)
  public async saveTags(
    @Args('tags', { type: () => [TagInput] })
    tags: TagInput[]
  ) {
    await this.paramsService.updateTags(tags);
    return { success: true, message: 'TAGS_UPDATED' };
  }

  @Query((_returns) => ParamsHash)
  public async getParams() {
    const results = await this.parameterDAO.find({ order: { key: 'ASC' } });
    return Object.fromEntries(results.map((param) => [param.key, param.value]));
  }

  @Mutation((_returns) => GraphQLCommonResponse)
  public async updateParams(
    @Args('params', { type: () => [UpdateParamsInput] })
    params: UpdateParamsInput[]
  ) {
    await map(params, async ({ key, value }) => {
      const param = await this.parameterDAO.findOrCreate({
        key: key as ParameterKey,
        value,
      });
      await this.parameterDAO.save({
        id: param.id,
        value,
      });
      this.logger.info('param updated', { key, value });
    });
    return { success: true, message: `PARAMS_CORRECTLY_UPDATED` };
  }
}
