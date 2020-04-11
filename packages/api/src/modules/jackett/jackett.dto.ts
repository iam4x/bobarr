import { ObjectType, Field } from '@nestjs/graphql';
import BigInt from 'graphql-bigint';

export interface JackettResult {
  FirstSeen: string;
  Tracker: string;
  TrackerId: string;
  CategoryDesc: string;
  Title: string;
  Guid: string;
  Link: string;
  Comments: string;
  PublishDate: string;
  Category: number[];
  Size: number;
  Grabs: number;
  Seeders: number;
  Peers: number;
  MinimumRatio: number;
  MinimumSeedTime: number;
  DownloadVolumeFactor: number;
  UploadVolumeFactor: number;
}

@ObjectType()
export class JackettFormattedResult {
  @Field() public id!: string;
  @Field() public title!: string;
  @Field() public quality!: string;
  @Field() public qualityScore!: number;
  @Field() public seeders!: number;
  @Field() public peers!: number;
  @Field() public link!: string;
  @Field() public downloadLink!: string;
  @Field() public tag!: string;
  @Field() public tagScore!: number;
  @Field() public publishDate!: string;
  @Field((_type) => [String]) public normalizedTitle!: string[];
  @Field((_type) => BigInt) public size!: BigInt;
}
