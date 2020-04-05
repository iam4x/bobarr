import { EntityRepository, Repository } from 'typeorm';
import { TVSeason } from '../tvseason.entity';

@EntityRepository(TVSeason)
export class TVSeasonDAO extends Repository<TVSeason> {}
