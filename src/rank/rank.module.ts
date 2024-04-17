import { Module } from '@nestjs/common';
import { RankController } from './rank.controller';
import { RankService } from './rank.service';
import { StatModule } from '../stat/stat.module';

@Module({
    imports: [StatModule],
    controllers: [RankController],
    providers: [RankService],
})
export class RankModule {}
