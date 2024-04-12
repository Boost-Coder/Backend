import { Module } from '@nestjs/common';
import { RankController } from './rank.controller';
import { RankService } from './rank.service';
import { GithubModule } from '../github/github.module';
import { AlgorithmModule } from '../algorithm/algorithm.module';
import { GradeModule } from '../grade/grade.module';

@Module({
    imports: [GithubModule, AlgorithmModule, GradeModule],
    controllers: [RankController],
    providers: [RankService],
})
export class RankModule {}
