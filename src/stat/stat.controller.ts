import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AlgorithmService } from './service/algorithm.service';
import { GithubService } from './service/github.service';
import { GradeService } from './service/grade.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { CreateAlgorithmDto } from './dto/createAlgorithm.dto';
import { UserId } from '../decorator/user-id.decorator';
import { OwnershipGuard } from '../auth/guard/ownership.guard';
import { CreateGithubDto } from './dto/createGitub.dto';
import { StatFindDto } from './dto/stat-find.dto';
import { TotalService } from './service/total.service';

@UseGuards(JwtAuthGuard)
@Controller('api/stat')
export class StatController {
    constructor(
        private readonly algorithmService: AlgorithmService,
        private readonly githubService: GithubService,
        private readonly gradeService: GradeService,
        private readonly totalService: TotalService,
    ) {}

    @Get(':id')
    async statFind(@Param('id') userId: string): Promise<StatFindDto> {
        return await this.totalService.findStat(userId);
    }

    @Post('algorithm')
    async algorithmCreate(@Body() body: CreateAlgorithmDto, @UserId() userId) {
        await this.algorithmService.createAlgorithm(userId, body.bojId);
    }

    @UseGuards(OwnershipGuard)
    @Patch('algorithm/:id')
    async algorithmModify(
        @Param('id') userId,
        @Body() body: CreateAlgorithmDto,
    ) {
        await this.algorithmService.modifyAlgorithm(userId, body.bojId);
    }

    @UseGuards(OwnershipGuard)
    @Delete('algorithm/:id')
    async algorithmRemove(@Param('id') userId) {
        await this.algorithmService.removeAlgorithm(userId);
    }

    @Post('github')
    public async gitHubCreate(@Body() body: CreateGithubDto, @UserId() userId) {
        await this.githubService.createGithub(body, userId);
    }

    @UseGuards(OwnershipGuard)
    @Patch('github/:id')
    public async gitHubModify(
        @Param('id') userId: string,
        @Body() body: CreateGithubDto,
    ) {
        await this.githubService.modifyGithub(body, userId);
    }

    @UseGuards(OwnershipGuard)
    @Delete('github/:id')
    public async gitHubDelete(@Param('id') userId: string) {
        await this.githubService.deleteGithub(userId);
    }

    @Post('grade')
    public async createGrade(
        @Body('grade') grade: number,
        @UserId() userId: string,
    ) {
        await this.gradeService.gradeCreate(userId, grade);
    }

    @Patch('grade/:id')
    @UseGuards(OwnershipGuard)
    public async modifyGrade(
        @Body('grade') grade: number,
        @Param('id') userId: string,
    ) {
        await this.gradeService.gradeModify(userId, grade);
    }

    @Delete('grade/:id')
    @UseGuards(OwnershipGuard)
    public async deleteGrade(@Param('id') userId: string) {
        await this.gradeService.gradeDelete(userId);
    }
}
