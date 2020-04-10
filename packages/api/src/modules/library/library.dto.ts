import { ObjectType, Field } from '@nestjs/graphql';

import { Movie } from 'src/entities/movie.entity';
import { TVShow } from 'src/entities/tvshow.entity';
import { TVEpisode } from 'src/entities/tvepisode.entity';

@ObjectType()
export class EnrichedMovie extends Movie {
  @Field({ nullable: true }) public posterPath?: string;
  @Field() public voteAverage!: number;
  @Field() public releaseDate!: string;
}

@ObjectType()
export class EnrichedTVShow extends TVShow {
  @Field({ nullable: true }) public posterPath?: string;
  @Field() public voteAverage!: number;
  @Field() public releaseDate!: string;
}

@ObjectType()
export class EnrichedTVEpisode extends TVEpisode {
  @Field() public voteAverage!: number;
  @Field() public releaseDate?: string;
}

@ObjectType()
export class DownloadingMedia {
  @Field() public title!: string;
  @Field() public tag!: string;
  @Field() public quality!: string;
  @Field() public torrent!: string;
  @Field() public resourceId!: number;
  @Field() public resourceType!: string;
}
