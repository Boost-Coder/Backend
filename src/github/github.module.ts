import { Module } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';
import { GithubRepository } from './github.repository';

@Module({
    providers: [GithubService, GithubRepository],
    controllers: [GithubController],
})
export class GithubModule {}
