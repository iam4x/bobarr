import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class ParamsHash {
  @Field() public region!: string;
  @Field() public language!: string;
  @Field() public tmdb_api_key!: string;
  @Field() public jackett_api_key!: string;
  @Field() public max_movie_download_size!: string;
  @Field() public max_tvshow_episode_download_size!: string;
  @Field() public preferred_tags!: string;
}

@InputType()
export class QualityInput {
  @Field() public id!: number;
  @Field() public score!: number;
}
