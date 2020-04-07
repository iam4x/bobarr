import { Resolver, Mutation } from '@nestjs/graphql';
import { GraphQLCommonResponse } from 'src/app.dto';
import { JobsService } from './jobs.service';

@Resolver()
export class JobsResolver {
  public constructor(private readonly jobsService: JobsService) {}

  @Mutation((_returns) => GraphQLCommonResponse)
  public async startScanLibraryJob() {
    await this.jobsService.startScanLibrary();
    return { success: true, message: 'SCAN_LIBRARY_FOLDER_STARTED' };
  }
}
