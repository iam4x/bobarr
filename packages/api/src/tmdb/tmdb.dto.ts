import { ObjectType, Field } from '@nestjs/graphql';

export interface TMDBMovie {
  id: number;
  adult: boolean;
  backdrop_path: string;
  budget: number;
  genres: Array<{ id: number; name: string }>;
  homepage: string;
  imdb_id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  revenue: number;
  runtime: number;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TMDBTVShow {
  id: number;
  backdrop_path: string;
  first_air_date: string;
  genre_ids: number[];
  name: string;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  vote_average: number;
  vote_count: number;
}

@ObjectType()
export class TMDBSearchResult {
  @Field() public id!: number;
  @Field() public title!: string;
  @Field() public voteAverage!: number;
  @Field({ nullable: true }) public posterPath?: string;
  @Field({ nullable: true }) public releaseDate?: string;
}

@ObjectType()
export class TMDBSearchResults {
  @Field((_type) => [TMDBSearchResult]) public movies!: TMDBSearchResult[];
  @Field((_type) => [TMDBSearchResult]) public tvShows!: TMDBSearchResult[];
}
