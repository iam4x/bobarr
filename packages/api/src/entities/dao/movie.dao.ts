import { EntityRepository, Repository } from 'typeorm';
import { Movie } from '../movie.entity';

@EntityRepository(Movie)
export class MovieDAO extends Repository<Movie> {}
