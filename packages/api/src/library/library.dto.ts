import { ObjectType, Field } from '@nestjs/graphql';
import { Movie } from 'src/entities/movie.entity';

@ObjectType()
export class EnrichedMovie extends Movie {
  @Field({ nullable: true }) public posterPath?: string;
  @Field() public voteAverage!: number;
  @Field() public releaseDate!: string;
}
