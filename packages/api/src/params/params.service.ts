import { Injectable } from '@nestjs/common';
import { ParameterDAO } from 'src/entities/dao/parameter.dao';
import { ParameterKey } from 'src/app.dto';

@Injectable()
export class ParamsService {
  public constructor(private readonly parameterDAO: ParameterDAO) {
    this.initializeParamsStore();
  }

  private async initializeParamsStore() {
    await this.parameterDAO.findOrCreate({
      key: ParameterKey.LANGUAGE,
      value: 'en',
    });
    await this.parameterDAO.findOrCreate({
      key: ParameterKey.REGION,
      value: 'US',
    });
    await this.parameterDAO.findOrCreate({
      key: ParameterKey.TMDB_API_KEY,
      value: 'c8eeff686ad913601c151cd0bc59c2e6',
    });
  }

  public async get(key: ParameterKey) {
    const param = await this.parameterDAO.findOne({ key });
    return param?.value;
  }
}
