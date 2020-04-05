import { EntityRepository, Repository } from 'typeorm';
import { TVSeason } from '../tvseason.entity';

@EntityRepository(TVSeason)
export class TVSeasonDAO extends Repository<TVSeason> {
  public async inLibrary(tvShowTMDBId: number, seasonNumber: number) {
    const match = await this.createQueryBuilder('tvSeason')
      .innerJoinAndSelect(
        'tvSeason.tvShow',
        'tvShow',
        'tvShow.tmdbId = :tvShowTMDBId',
        { tvShowTMDBId }
      )
      .where('tvSeason.seasonNumber = :seasonNumber', { seasonNumber })
      .getOne();
    return match !== undefined;
  }
}
