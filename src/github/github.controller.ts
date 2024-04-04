import { Controller, Get, Post, Query } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('api/stat/github')
export class GithubController {
    constructor(private readonly githubService: GithubService) {}
    @Get('redirect')
    public gitHubCreate(@Query('code') code: string) {
        this.githubService.createGithub(code);
    }
}
