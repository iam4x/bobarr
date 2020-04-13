import { Injectable } from '@nestjs/common';
import { map, forEachSeries } from 'p-iteration';

import { ParameterKey } from 'src/app.dto';

import { ParameterDAO } from 'src/entities/dao/parameter.dao';
import { QualityDAO } from 'src/entities/dao/quality.dao';
import { TagDAO } from 'src/entities/dao/tag.dao';
import { TagInput } from './params.dto';
import {
  Transaction,
  TransactionManager,
  EntityManager,
  Not,
  In,
} from 'typeorm';

@Injectable()
export class ParamsService {
  public constructor(
    private readonly parameterDAO: ParameterDAO,
    private readonly qualityDAO: QualityDAO,
    private readonly tagDAO: TagDAO
  ) {
    this.initializeParamsStore();
    this.initializeQuality();
    this.initializeTags();
  }

  private async initializeParamsStore() {
    const defaultParams: Array<[ParameterKey, string]> = [
      [ParameterKey.LANGUAGE, 'en'],
      [ParameterKey.REGION, 'US'],
      [ParameterKey.TMDB_API_KEY, 'c8eeff686ad913601c151cd0bc59c2e6'],
      [ParameterKey.MAX_MOVIE_DOWNLOAD_SIZE, (20e9).toString()], // max file size 20gb
      [ParameterKey.MAX_TVSHOW_EPISODE_DOWNLOAD_SIZE, (5e9).toString()], // max file size 5gb
      [ParameterKey.JACKETT_API_KEY, ''],
    ];

    await map(defaultParams, ([key, value]) =>
      this.parameterDAO.findOrCreate({ key, value })
    );
  }

  private async initializeQuality() {
    const defaultQualities = [
      { name: '4K', match: ['uhd', '4k', '2160', '2160p'], score: 4 },
      { name: '1440p', match: ['1440', '1440p'], score: 3 },
      { name: '1080p', match: ['1080', '1080p'], score: 2 },
      { name: '720p', match: ['720', '720p'], score: 1 },
    ];

    await map(defaultQualities, async (quality) => {
      const match = await this.qualityDAO.findOne({
        where: { name: quality.name },
      });

      if (!match) {
        await this.qualityDAO.save(quality);
      }
    });
  }

  private async initializeTags() {
    if ((await this.tagDAO.count()) === 0) {
      await this.tagDAO.save([
        { name: 'multi', score: 2 },
        { name: 'vost', score: 1 },
      ]);
    }
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

  public getQualities() {
    return this.qualityDAO.find({ order: { score: 'DESC' } });
  }

  public getTags() {
    return this.tagDAO.find({ order: { score: 'DESC' } });
  }

  @Transaction()
  public async updateTags(
    tags: TagInput[],
    @TransactionManager() manager?: EntityManager
  ) {
    const tagDAO = manager!.getCustomRepository(TagDAO);
    await tagDAO.delete({ name: Not(In(tags.map((tag) => tag.name))) });
    await forEachSeries(tags, async (tag) => {
      const match = await tagDAO.findOne({ name: tag.name });
      return match
        ? await tagDAO.save({ id: match.id, score: tag.score })
        : await tagDAO.save(tag);
    });
  }
}
