import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class JackettResult {
  @Field() public FirstSeen!: string;
  @Field() public Tracker!: string;
  @Field() public TrackerId!: string;
  @Field() public CategoryDesc!: string;
  @Field() public Title!: string;
  @Field() public Guid!: string;
  @Field() public Link!: string;
  @Field() public Comments!: string;
  @Field() public PublishDate!: string;
  @Field() public Category!: number[];
  @Field() public Size!: number;
  @Field() public Grabs!: number;
  @Field() public Seeders!: number;
  @Field() public Peers!: number;
  @Field() public MinimumRatio!: number;
  @Field() public MinimumSeedTime!: number;
  @Field() public DownloadVolumeFactor!: number;
  @Field() public UploadVolumeFactor!: number;
}
