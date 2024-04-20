import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { UserModule } from '../user/user.module';
import { StatModule } from '../stat/stat.module';

@Module({
    imports: [UserModule, StatModule],
    providers: [BatchService],
})
export class BatchModule {}
