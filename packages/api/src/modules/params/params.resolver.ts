import { Resolver, ObjectType, Field, Query } from '@nestjs/graphql';
import { ParameterDAO } from 'src/entities/dao/parameter.dao';

@ObjectType()
class ParamsHash {
  @Field() public language!: string;
  @Field() public region!: string;
}

@Resolver()
export class ParamsResolver {
  public constructor(private readonly parameterDAO: ParameterDAO) {}

  @Query((_returns) => ParamsHash)
  public async getParams() {
    const results = await this.parameterDAO.find({ order: { key: 'ASC' } });
    return Object.fromEntries(results.map((param) => [param.key, param.value]));
  }
}
