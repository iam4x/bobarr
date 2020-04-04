import { Module, forwardRef } from '@nestjs/common';

import { ParamsModule } from 'src/modules/params/params.module';
import { LibraryModule } from 'src/modules/library/library.module';

import { JackettService } from './jackett.service';

@Module({
  imports: [ParamsModule, forwardRef(() => LibraryModule)],
  providers: [JackettService],
  exports: [JackettService],
})
export class JackettModule {}
