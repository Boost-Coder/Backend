import {
    Body,
    Controller,
    Delete,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { GithubService } from './github.service';
import { CreateGithubDto } from './createGitub.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserId } from '../decorator/user-id.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/stat/github')
export class GithubController {
    constructor(private readonly githubService: GithubService) {}

    @Post()
    public async gitHubCreate(@Body() body: CreateGithubDto, @UserId() userId) {
        await this.githubService.createGithub(body, userId);
    }

    @Patch(':id')
    public async gitHubModify(
        @Param('id') userId: string,
        @Body() body: CreateGithubDto,
    ) {
        await this.githubService.modifyGithub(body, userId);
    }

    @Delete(':id')
    public async gitHubDelete(@Param('id') userId: string) {
        await this.githubService.deleteGithub(userId);
    }

    // @Get('redirect')
    // public async redirect(@Query('code') code: string) {
    //     await this.githubService.redirect(code);
    // }
}
