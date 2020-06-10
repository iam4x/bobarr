import { Injectable } from '@nestjs/common';
import { map, forEachSeries } from 'p-iteration';

import {
  Transaction,
  TransactionManager,
  EntityManager,
  Not,
  In,
  IsNull,
} from 'typeorm';

import { ParameterKey } from 'src/app.dto';
import { LazyTransaction } from 'src/utils/lazy-transaction';

import { Entertainment } from 'src/modules/tmdb/tmdb.dto';

import { ParameterDAO } from 'src/entities/dao/parameter.dao';
import { QualityDAO } from 'src/entities/dao/quality.dao';
import { TagDAO } from 'src/entities/dao/tag.dao';
import { Quality } from 'src/entities/quality.entity';

import { TagInput } from './params.dto';

@Injectable()
export class ParamsService {
  public constructor(
    private readonly parameterDAO: ParameterDAO,
    private readonly qualityDAO: QualityDAO,
    private readonly tagDAO: TagDAO
  ) {
    this.initializeParamsStore(null);
    this.initializeQuality(null);
  }

  @LazyTransaction()
  public async initializeParamsStore(
    @TransactionManager() manager: EntityManager | null
  ) {
    const defaultParams: Array<[ParameterKey, string]> = [
      [ParameterKey.LANGUAGE, 'en'],
      [ParameterKey.REGION, 'US'],
      [ParameterKey.TMDB_API_KEY, 'c8eeff686ad913601c151cd0bc59c2e6'],
      [ParameterKey.MAX_MOVIE_DOWNLOAD_SIZE, (20e9).toString()], // max file size 20gb
      [ParameterKey.MAX_TVSHOW_EPISODE_DOWNLOAD_SIZE, (5e9).toString()], // max file size 5gb
      [ParameterKey.JACKETT_API_KEY, ''],
    ];

    await map(defaultParams, ([key, value]) =>
      manager!.getCustomRepository(ParameterDAO).findOrCreate({ key, value })
    );
  }

  @LazyTransaction()
  public async initializeQuality(
    @TransactionManager() manager: EntityManager | null
  ) {
    const qualityDAO = manager!.getCustomRepository(QualityDAO);
    const defaultQualities: Array<Omit<
      Quality,
      'id' | 'createdAt' | 'updatedAt'
    >> = [
      {
        type: Entertainment.Movie,
        name: '4K',
        match: ['uhd', '4k', '2160', '2160p'],
        score: 4,
      },
      {
        type: Entertainment.Movie,
        name: '1440p',
        match: ['1440', '1440p'],
        score: 3,
      },
      {
        type: Entertainment.Movie,
        name: '1080p',
        match: ['1080', '1080p'],
        score: 2,
      },
      {
        type: Entertainment.Movie,
        name: '720p',
        match: ['720', '720p'],
        score: 1,
      },
      {
        type: Entertainment.TvShow,
        name: '4K',
        match: ['uhd', '4k', '2160', '2160p'],
        score: 4,
      },
      {
        type: Entertainment.TvShow,
        name: '1440p',
        match: ['1440', '1440p'],
        score: 3,
      },
      {
        type: Entertainment.TvShow,
        name: '1080p',
        match: ['1080', '1080p'],
        score: 2,
      },
      {
        type: Entertainment.TvShow,
        name: '720p',
        match: ['720', '720p'],
        score: 1,
      },
    ];

    await map(defaultQualities, async (quality) => {
      const match = await qualityDAO.findOne({
        where: { name: quality.name, type: quality.type },
      });

      if (!match) {
        await qualityDAO.save(quality);
      }
    });
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

  public async getQualities(type?: Entertainment) {
    const qualities = await this.qualityDAO.find({
      order: { type: 'ASC', score: 'DESC' },
    });
    return type === Entertainment.Movie
      ? qualities.filter((q) => q.type === Entertainment.Movie)
      : qualities.filter((q) => q.type === Entertainment.TvShow);
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
    await tagDAO.delete(
      tags.length > 0
        ? { name: Not(In(tags.map((tag) => tag.name))) }
        : { id: Not(IsNull()) }
    );
    await forEachSeries(tags, async (tag) => {
      const match = await tagDAO.findOne({ name: tag.name });
      return match
        ? await tagDAO.save({ id: match.id, score: tag.score })
        : await tagDAO.save(tag);
    });
  }
}
