import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { GraphQLCommonResponse, ParameterKey } from 'src/app.dto';

import { ParameterDAO } from 'src/entities/dao/parameter.dao';
import { QualityDAO } from 'src/entities/dao/quality.dao';
import { Quality } from 'src/entities/quality.entity';

import { ParamsHash, QualityInput } from './params.dto';

@Resolver()
export class ParamsResolver {
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly parameterDAO: ParameterDAO,
    private readonly qualityDAO: QualityDAO
  ) {
    this.logger = logger.child({ context: 'ParamsResolver' });
  }

  @Query((_returns) => [Quality])
  public getQualityParams() {
    return this.qualityDAO.find({ order: { score: 'DESC' } });
  }

  @Mutation((_returns) => GraphQLCommonResponse)
  public async saveQualityParams(
    @Args('qualities', { type: () => [QualityInput] }) qualities: QualityInput[]
  ) {
    await this.qualityDAO.save(qualities);
    return { success: true, message: 'QUALITY_PARAMS_UPDATED' };
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
