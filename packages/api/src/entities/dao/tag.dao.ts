import { EntityRepository, Repository } from 'typeorm';
import { Tag } from '../tag.entity';

@EntityRepository(Tag)
export class TagDAO extends Repository<Tag> {}
