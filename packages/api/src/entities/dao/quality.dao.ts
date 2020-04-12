import { EntityRepository, Repository } from 'typeorm';
import { Quality } from '../quality.entity';

@EntityRepository(Quality)
export class QualityDAO extends Repository<Quality> {}
