import { ObjectType, Field } from '@nestjs/graphql';

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
  @Field({ nullable: true }) public posterPath?: string;
  @Field({ nullable: true }) public releaseDate?: string;
}

@ObjectType()
export class TMDBSearchResults {
  @Field((_type) => [TMDBSearchResult]) public movies!: TMDBSearchResult[];
  @Field((_type) => [TMDBSearchResult]) public tvShows!: TMDBSearchResult[];
}
