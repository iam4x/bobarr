import { EntityRepository, Repository, DeepPartial } from 'typeorm';
import { TVShow } from '../tvshow.entity';

@EntityRepository(TVShow)
export class TVShowDAO extends Repository<TVShow> {
  public async findOrCreate(tvShowAttributes: DeepPartial<TVShow>) {
    if (!tvShowAttributes.tmdbId) {
      throw new Error('findOrCreate TVShow needs [tmdbId]');
    }

    const tvShow = await this.findOne({
      where: { tmdbId: tvShowAttributes.tmdbId },
    });

    return tvShow || this.save(tvShowAttributes);
  }
}
