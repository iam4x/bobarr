import { EntityRepository, Repository } from 'typeorm';

import { TVEpisode } from '../tvepisode.entity';
import { TVShow } from '../tvshow.entity';

@EntityRepository(TVEpisode)
export class TVEpisodeDAO extends Repository<TVEpisode> {
  public async findOrCreate(episodeAttributes: {
    tvShow: TVShow;
    episodeNumber: number;
    seasonNumber: number;
  }) {
    const match = await this.findOne(episodeAttributes);
    return match || (await this.save(episodeAttributes));
  }
}
