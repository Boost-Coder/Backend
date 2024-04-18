import { Module } from '@nestjs/common';
import { StatController } from './stat.controller';
import { GithubService } from './service/github.service';
import { GithubRepository } from './repository/github.repository';
import { AlgorithmService } from './service/algorithm.service';
import { AlgorithmRepository } from './repository/algorithm.repository';
import { GradeService } from './service/grade.service';
import { GradeRepository } from './repository/grade.repository';
import { TotalService } from './service/total.service';
import { TotalRepository } from './repository/total.repository';
import { RankController } from './rank.controller';

@Module({
    controllers: [StatController, RankController],
    providers: [
        GithubService,
        GithubRepository,
        AlgorithmService,
        AlgorithmRepository,
        GradeService,
        GradeRepository,
        TotalService,
        TotalRepository,
    ],
    exports: [TotalService, GithubService, AlgorithmService, GradeService],
})
export class StatModule {}
