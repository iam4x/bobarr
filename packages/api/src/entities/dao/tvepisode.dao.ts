import { EntityRepository, Repository } from 'typeorm';

import { DownloadableMediaState } from 'src/app.dto';

import { TVEpisode } from '../tvepisode.entity';

@EntityRepository(TVEpisode)
export class TVEpisodeDAO extends Repository<TVEpisode> {
  public async findOrCreate(episodeAttributes: {
    seasonId: number;
    tvShowId: number;
    episodeNumber: number;
    seasonNumber: number;
  }) {
    const match = await this.findOne(episodeAttributes);
    return match || (await this.save(episodeAttributes));
  }

  public findMissingFromLibrary() {
    return this.createQueryBuilder('episode')
      .leftJoinAndSelect('episode.tvShow', 'tvShow')
      .innerJoin('episode.season', 'season', 'season.state != :seasonState', {
        seasonState: DownloadableMediaState.DOWNLOADING,
      })
      .where('episode.state = :episodeState', {
        episodeState: DownloadableMediaState.MISSING,
      })
      .orderBy('episode.tvShow', 'DESC')
      .addOrderBy('episode.season', 'DESC')
      .addOrderBy('episode.episodeNumber', 'DESC')
      .getMany();
  }
}
