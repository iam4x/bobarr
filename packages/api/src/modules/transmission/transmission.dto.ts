import { ObjectType, Field, Int, Float, InputType } from '@nestjs/graphql';
import BigInt from 'graphql-bigint';
import { FileType } from 'src/app.dto';

@ObjectType()
export class TorrentStatus {
  @Field((_type) => Int) public id!: number;
  @Field((_type) => Int) public resourceId!: number;
  @Field((_type) => FileType) public resourceType!: FileType;
  @Field((_type) => Float) public percentDone!: number;
  @Field((_type) => Int) public rateDownload!: number;
  @Field((_type) => Int) public rateUpload!: number;
  @Field((_type) => Float) public uploadRatio!: number;
  @Field((_type) => BigInt) public uploadedEver!: number;
  @Field((_type) => BigInt) public totalSize!: number;
  @Field((_type) => Int) public status!: number;
}

@InputType()
export class GetTorrentStatusInput {
  @Field((_type) => Int) public resourceId!: number;
  @Field((_type) => FileType) public resourceType!: FileType;
}
