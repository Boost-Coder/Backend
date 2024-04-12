import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { GithubRepository } from './github.repository';
import { GradeService } from '../grade/grade.service';

@Module({
    providers: [GithubService, GithubRepository],
    controllers: [GithubController],
    exports: [GithubService],
})
export class GithubModule {}
