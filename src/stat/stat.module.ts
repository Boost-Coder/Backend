import { Module } from '@nestjs/common';
import { StatController } from './stat.controller';
import { GithubService } from './service/github.service';
import { GithubRepository } from './repository/github.repository';
import { AlgorithmService } from './service/algorithm.service';
import { AlgorithmRepository } from './repository/algorithm.repository';
import { GradeService } from './service/grade.service';
import { GradeRepository } from './repository/grade.repository';

@Module({
    controllers: [StatController],
    providers: [
        GithubService,
        GithubRepository,
        AlgorithmService,
        AlgorithmRepository,
        GradeService,
        GradeRepository,
    ],
})
export class StatModule {}
