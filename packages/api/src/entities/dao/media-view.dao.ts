import { EntityRepository, Repository } from 'typeorm';
import { MediaView } from '../media-view.entity';

@EntityRepository(MediaView)
export class MediaViewDAO extends Repository<MediaView> {}
