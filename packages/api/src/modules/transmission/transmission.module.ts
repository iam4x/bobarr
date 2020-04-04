import { Module } from '@nestjs/common';
import { TransmissionService } from './transmission.service';

@Module({
  imports: [],
  providers: [TransmissionService],
  exports: [TransmissionService],
})
export class TransmissionModule {}
