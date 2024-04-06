import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { GithubService } from './github.service';
import { CreateGithubDto } from './createGitub.dto';

@Controller('api/stat/github')
export class GithubController {
    constructor(private readonly githubService: GithubService) {}

    @Get('redirect')
    public redirect(@Query('code') code: string) {
        this.githubService.redirect(code);
    }
    @Post(':id')
    public gitHubCreate(@Body() body: CreateGithubDto) {
        const userId = 'userId';
        this.githubService.createGithub(body, userId);
    }

    @Patch(':id')
    public gitHubModify(@Body() body: CreateGithubDto) {
        const userId = 'userId';
        this.githubService.modifyGithub(body, userId);
    }
}
