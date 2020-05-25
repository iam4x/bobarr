import { ObjectType, Field, ArgsType, registerEnumType } from '@nestjs/graphql';
export interface TMDBRequestParams {
  query?: string;
  language?: string;
  region?: string;
  year?: number;
  with_genres?: string;
  'vote_count.gte'?: number;
  'vote_average.gte'?: number;
  with_original_language?: string;
  primary_release_year?: number; // movie
  first_air_date_year?: number; // tv show
  page?: number;
}

export interface TMDBMovie {
  id: number;
  adult: boolean;
  backdrop_path: string;
  budget: number;
  genres: Array<{ id: number; name: string }>;
  homepage: string;
  imdb_id: number;
  original_language: string[];
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
  episode_run_time: number[];
  first_air_date: string;
  homepage: string;
  in_production: true;
  languages: string[];
  last_air_date: string;
  name: string;
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  status: string;
  type: string;
  vote_average: number;
  vote_count: number;
  genres: Array<{ id: number; name: string }>;
  seasons: Array<{
    id: number;
    name: string;
    air_date: string;
    episode_count: number;
    overview: string;
    poster_path: string;
    season_number: number;
  }>;
  last_episode_to_air: {
    id: number;
    name: string;
    air_date: string;
    episode_number: number;
    overview: string;
    production_code: string;
    season_number: number;
    show_id: number;
    still_path: string;
    vote_average: number;
    vote_count: number;
  };
  created_by: Array<{
    id: number;
    credit_id: string;
    gender: number;
    name: string;
    profile_path?: string;
  }>;
}

export interface TMDBTVEpisode {
  id: number;
  air_date: string;
  episode_number: number;
  name: string;
  overview: string;
  production_code: string;
  season_number: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}

export interface TMDBLanguage {
  iso_639_1: string;
  english_name: string;
  name: string;
}

export interface TMDBGenres {
  id: number;
  name: string;
}

export interface TMDBPagination<TPagination> {
  page: number;
  total_results: number;
  total_pages: number;
  results: TPagination;
}

@ObjectType()
export class TMDBFormattedTVEpisode {
  @Field() public id!: number;
  @Field() public episodeNumber!: number;
  @Field() public name!: string;
  @Field() public overview!: string;
  @Field() public seasonNumber!: number;
  @Field({ nullable: true }) public voteCount!: number;
  @Field({ nullable: true }) public voteAverage!: number;
  @Field({ nullable: true }) public airDate!: string;
  @Field({ nullable: true }) public stillPath!: string;
}

@ObjectType()
export class TMDBFormattedTVSeason {
  @Field() public id!: number;
  @Field() public name!: string;
  @Field() public seasonNumber!: number;
  @Field() public inLibrary!: boolean;
  @Field({ nullable: true }) public overview!: string;
  @Field({ nullable: true }) public airDate!: string;
  @Field({ nullable: true }) public episodeCount!: number;
  @Field({ nullable: true }) public posterPath!: string;
  @Field((_type) => [TMDBFormattedTVEpisode], { nullable: true })
  public episodes!: TMDBFormattedTVEpisode[];
}

@ObjectType()
export class TMDBSearchResult {
  @Field() public id!: number;
  @Field() public tmdbId!: number;
  @Field() public title!: string;
  @Field() public voteAverage!: number;
  @Field() public overview!: string;
  @Field({ nullable: true }) public runtime!: number;
  @Field({ nullable: true }) public posterPath?: string;
  @Field({ nullable: true }) public releaseDate?: string;
}

@ObjectType()
export class TMDBSearchResults {
  @Field((_type) => [TMDBSearchResult]) public movies!: TMDBSearchResult[];
  @Field((_type) => [TMDBSearchResult]) public tvShows!: TMDBSearchResult[];
}

@ObjectType()
export class TMDBPaginatedResult {
  @Field() public page!: number;
  @Field() public totalResults!: number;
  @Field() public totalPages!: number;
  @Field((_type) => [TMDBSearchResult]) public results!: TMDBSearchResult[];
}

@ObjectType()
export class TMDBLanguagesResult {
  @Field() public code!: string;
  @Field() public language!: string;
}

@ObjectType()
export class TMDBGenresResult {
  @Field() public id!: number;
  @Field() public name!: string;
}

@ObjectType()
export class TMDBGenresResults {
  @Field((_type) => [TMDBGenresResult])
  public movieGenres!: TMDBGenresResult[];
  @Field((_type) => [TMDBGenresResult])
  public tvShowGenres!: TMDBGenresResult[];
}

export enum Entertainment {
  TvShow = 'TvShow',
  Movie = 'Movie',
}

registerEnumType(Entertainment, {
  name: 'Entertainment',
});

@ArgsType()
export class GetDiscoverQueries {
  @Field({ nullable: true }) public originLanguage?: string;
  @Field({ nullable: true }) public primaryReleaseYear?: string;
  @Field({ nullable: true }) public score?: number;
  @Field((_type) => [Number], { nullable: true }) public genres?: number[];
  @Field({ nullable: true }) public page?: number;
  @Field((_type) => Entertainment) public entertainment: Entertainment =
    Entertainment.Movie;
}
