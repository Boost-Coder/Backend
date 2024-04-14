import { Module } from '@nestjs/common';
import { TotalService } from './total.service';
import { TotalRepository } from './total.repository';
import { GithubModule } from '../github/github.module';
import { AlgorithmModule } from '../algorithm/algorithm.module';
import { GradeModule } from '../grade/grade.module';

@Module({
    imports: [GithubModule, AlgorithmModule, GradeModule],
    providers: [TotalService, TotalRepository],
    exports: [TotalService],
})
export class TotalModule {}
