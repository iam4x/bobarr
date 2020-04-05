import { EntityRepository, Repository } from 'typeorm';
import { TVEpisode } from '../tvepisode.entity';

@EntityRepository(TVEpisode)
export class TVEpisodeDAO extends Repository<TVEpisode> {}
