import { ObjectType, Field } from '@nestjs/graphql';
import BigInt from 'graphql-bigint';

export interface JackettResult {
  FirstSeen: string;
  Tracker: string;
  TrackerId: string;
  CategoryDesc: string;
  Title: string;
  Guid: string;
  Link?: string;
  Comments: string;
  PublishDate: string;
  Category: number[];
  Size: number;
  Grabs: number;
  Seeders: number;
  Peers: number;
  MagnetUri?: string;
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
  @Field() public normalizedTitle!: string;
  @Field((_type) => [String]) public normalizedTitleParts!: string[];
  @Field((_type) => BigInt) public size!: BigInt;
}

export interface JackettIndexer {
  id: string;
  configured: boolean;
  title: string;
  description: string;
  link: string;
  language: string;
  type: string;
  caps: {
    server: {
      title: string;
    };
    searching: {
      search: {
        available: 'yes' | 'no';
        supportedParams: string;
      };
      tv: {
        available: 'yes' | 'no';
        supportedParams: string;
      };
      movie: {
        available: 'yes' | 'no';
        supportedParams: string;
      };
      music: {
        available: 'yes' | 'no';
        supportedParams: '';
      };
      audio: {
        available: 'yes' | 'no';
        supportedParams: string;
      };
    };
    categories: {
      category: Array<{
        id: string;
        name: string;
        subcat?: Array<{ id: string; name: string }>;
      }>;
    };
  };
}
