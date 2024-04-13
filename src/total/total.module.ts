import { Module } from '@nestjs/common';
import { TotalService } from './total.service';

@Module({
  providers: [TotalService]
})
export class TotalModule {}
