import { EntityRepository, Repository } from 'typeorm';
import { Torrent } from '../torrent.entity';

@EntityRepository(Torrent)
export class TorrentDAO extends Repository<Torrent> {}
