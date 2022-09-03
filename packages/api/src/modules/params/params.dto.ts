import { ObjectType, Field, InputType } from '@nestjs/graphql';

@ObjectType()
export class ParamsHash {
  @Field() public region!: string;
  @Field() public language!: string;
  @Field() public tmdb_api_key!: string;
  @Field() public jackett_api_key!: string;
  @Field() public jackett_url!: string;
  @Field() public max_movie_download_size!: string;
  @Field() public max_tvshow_episode_download_size!: string;
  @Field() public organize_library_strategy!: string;
}

@InputType()
export class UpdateParamsInput {
  @Field() public key!: string;
  @Field() public value!: string;
}

@InputType()
export class QualityInput {
  @Field() public id!: number;
  @Field() public score!: number;
}

@InputType()
export class TagInput {
  @Field() public name!: string;
  @Field() public score!: number;
}
