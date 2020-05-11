import { ArgsType, Field, ObjectType } from '@nestjs/graphql';

export interface OMDBSearchParams {
  t?: string;
}

export interface OMDBSearchResult {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

@ArgsType()
export class GetOMDBSearchQueries {
  @Field() public title!: string;
}

@ObjectType()
export class Ratings {
  @Field({ nullable: true }) public IMDB?: string;
  @Field({ nullable: true }) public rottenTomatoes?: string;
  @Field({ nullable: true }) public metaCritic?: string;
}

@ObjectType()
export class OMDBInfo {
  @Field() public ratings!: Ratings;
}
