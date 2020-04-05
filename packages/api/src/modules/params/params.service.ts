import { Injectable } from '@nestjs/common';
import { map } from 'p-iteration';

import { ParameterKey } from 'src/app.dto';
import { ParameterDAO } from 'src/entities/dao/parameter.dao';

@Injectable()
export class ParamsService {
  public constructor(private readonly parameterDAO: ParameterDAO) {
    this.initializeParamsStore();
  }

  private async initializeParamsStore() {
    const defaultParams: Array<[ParameterKey, string]> = [
      [ParameterKey.LANGUAGE, 'en'],
      [ParameterKey.REGION, 'US'],
      [ParameterKey.TMDB_API_KEY, 'c8eeff686ad913601c151cd0bc59c2e6'],
      [ParameterKey.MAX_MOVIE_DOWNLOAD_SIZE, (20e9).toString()], // max file size 20gb
      [ParameterKey.MAX_TVSHOW_EPISODE_DOWNLOAD_SIZE, (5e9).toString()], // max file size 5gb
      [ParameterKey.PREFERRED_TAGS, 'multi,vost'],
      [ParameterKey.JACKETT_API_KEY, ''],
    ];

    await map(defaultParams, ([key, value]) =>
      this.parameterDAO.findOrCreate({ key, value })
    );
  }

  public async get(key: ParameterKey) {
    const param = await this.parameterDAO.findOne({ key });
    return param?.value || '';
  }

  public async getNumber(key: ParameterKey) {
    const param = await this.parameterDAO.findOne({ key });
    return param?.value ? parseInt(param.value, 10) : 0;
  }

  public async getList(key: ParameterKey) {
    const param = await this.parameterDAO.findOne({ key });
    return param?.value ? param.value.split(',') : [];
  }
}
