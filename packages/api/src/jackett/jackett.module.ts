import { Module, forwardRef } from '@nestjs/common';

import { ParamsModule } from 'src/params/params.module';
import { LibraryModule } from 'src/library/library.module';

import { JackettService } from './jackett.service';

@Module({
  imports: [ParamsModule, forwardRef(() => LibraryModule)],
  providers: [JackettService],
  exports: [JackettService],
})
export class JackettModule {}
