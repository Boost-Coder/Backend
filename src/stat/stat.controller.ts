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
import {
    ApiBearerAuth,
    ApiBody,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('api/stat')
export class StatController {
    constructor(
        private readonly algorithmService: AlgorithmService,
        private readonly githubService: GithubService,
        private readonly gradeService: GradeService,
        private readonly totalService: TotalService,
    ) {}

    @ApiTags('stat')
    @ApiOperation({
        summary: '유저의 개발 역량 반환 API',
        description:
            '유저의 개발 역량을 반환한다. 깃허브, 알고리즘, 학점, 종합 점수를 반환한다.',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '유저 개발 역량 반환 성공',
        type: StatFindDto,
    })
    @ApiUnauthorizedResponse({
        description: 'jwt 관련 문제 (인증 시간이 만료됨, jwt를 보내지 않음)',
    })
    @ApiForbiddenResponse({
        description: '허용되지 않은 자원에 접근한 경우. 즉, 권한이 없는 경우',
    })
    @ApiNotFoundResponse({
        description:
            'user가 존재하지 않는 경우. 즉, 작업하려는 user가 존재하지 않는 경우',
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
    })
    @Get(':id')
    async statFind(@Param('id') userId: string): Promise<StatFindDto> {
        return await this.totalService.findStat(userId);
    }

    @ApiTags('stat')
    @ApiOperation({
        summary: '알고리즘 역량 등록 API',
        description:
            'BOJ 아이디를 등록한다. 없는 BOJ 아이디는 등록되지 않는다. 이미 등록된 경우도 등록되지 않는다. ',
    })
    @ApiBearerAuth('accessToken')
    @ApiCreatedResponse({
        description: '알고리즘 역량 등록 성공',
    })
    @ApiUnauthorizedResponse({
        description: 'jwt 관련 문제 (인증 시간이 만료됨, jwt를 보내지 않음)',
    })
    @ApiForbiddenResponse({
        description: '허용되지 않은 자원에 접근한 경우. 즉, 권한이 없는 경우',
    })
    @ApiNotFoundResponse({
        description:
            'user가 존재하지 않는 경우. 즉, 작업하려는 user가 존재하지 않는 경우',
    })
    @ApiConflictResponse({
        description: '이미 등록한 경우',
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
    })
    @Post('algorithm')
    async algorithmCreate(@Body() body: CreateAlgorithmDto, @UserId() userId) {
        await this.algorithmService.createAlgorithm(userId, body.bojId);
        await this.totalService.updateTotal(userId);
    }

    @ApiTags('stat')
    @ApiOperation({
        summary: '알고리즘 역량 수정 API',
        description:
            'BOJ 아이디를 수정한다. 없는 BOJ 아이디는 수정되지 않는다.',
    })
    @ApiBearerAuth('accessToken')
    @ApiCreatedResponse({
        description: '알고리즘 역량 수정 성공',
    })
    @ApiUnauthorizedResponse({
        description: 'jwt 관련 문제 (인증 시간이 만료됨, jwt를 보내지 않음)',
    })
    @ApiForbiddenResponse({
        description: '허용되지 않은 자원에 접근한 경우. 즉, 권한이 없는 경우',
    })
    @ApiNotFoundResponse({
        description:
            'user가 존재하지 않는 경우. 즉, 작업하려는 user가 존재하지 않는 경우',
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
    })
    @UseGuards(OwnershipGuard)
    @Patch('algorithm/:id')
    async algorithmModify(
        @Param('id') userId,
        @Body() body: CreateAlgorithmDto,
    ) {
        await this.algorithmService.modifyAlgorithm(userId, body.bojId);
        await this.totalService.updateTotal(userId);
    }

    @ApiTags('stat')
    @UseGuards(OwnershipGuard)
    @Delete('algorithm/:id')
    async algorithmRemove(@Param('id') userId) {
        await this.algorithmService.removeAlgorithm(userId);
        await this.totalService.updateTotal(userId);
    }

    @ApiTags('stat')
    @Post('github')
    public async gitHubCreate(@Body() body: CreateGithubDto, @UserId() userId) {
        await this.githubService.createGithub(body, userId);
        await this.totalService.updateTotal(userId);
    }

    @ApiTags('stat')
    @UseGuards(OwnershipGuard)
    @Patch('github/:id')
    public async gitHubModify(
        @Param('id') userId: string,
        @Body() body: CreateGithubDto,
    ) {
        await this.githubService.modifyGithub(body, userId);
        await this.totalService.updateTotal(userId);
    }

    @ApiTags('stat')
    @UseGuards(OwnershipGuard)
    @Delete('github/:id')
    public async gitHubDelete(@Param('id') userId: string) {
        await this.githubService.deleteGithub(userId);
        await this.totalService.updateTotal(userId);
    }

    @ApiTags('stat')
    @ApiOperation({
        summary: '학점 역량 등록 API',
        description: '학점을 등록한다. 이미 등록된 경우는 등록되지 않는다. ',
    })
    @ApiBearerAuth('accessToken')
    @ApiCreatedResponse({
        description: '학점 역량 등록 성공',
    })
    @ApiUnauthorizedResponse({
        description: 'jwt 관련 문제 (인증 시간이 만료됨, jwt를 보내지 않음)',
    })
    @ApiForbiddenResponse({
        description: '허용되지 않은 자원에 접근한 경우. 즉, 권한이 없는 경우',
    })
    @ApiNotFoundResponse({
        description:
            'user가 존재하지 않는 경우. 즉, 작업하려는 user가 존재하지 않는 경우',
    })
    @ApiConflictResponse({
        description: '이미 등록한 경우',
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                grade: {
                    type: 'number',
                },
            },
        },
    })
    @Post('grade')
    public async createGrade(
        @Body('grade') grade: number,
        @UserId() userId: string,
    ) {
        await this.gradeService.gradeCreate(userId, grade);
        await this.totalService.updateTotal(userId);
    }

    @ApiTags('stat')
    @ApiOperation({
        summary: '학점 역량 수정 API',
        description: '학점을 수정한다.',
    })
    @ApiBearerAuth('accessToken')
    @ApiCreatedResponse({
        description: '학점 역량 수정 성공',
    })
    @ApiUnauthorizedResponse({
        description: 'jwt 관련 문제 (인증 시간이 만료됨, jwt를 보내지 않음)',
    })
    @ApiForbiddenResponse({
        description: '허용되지 않은 자원에 접근한 경우. 즉, 권한이 없는 경우',
    })
    @ApiNotFoundResponse({
        description:
            'user가 존재하지 않는 경우. 즉, 작업하려는 user가 존재하지 않는 경우',
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
    })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                grade: {
                    type: 'number',
                },
            },
        },
    })
    @Patch('grade/:id')
    @UseGuards(OwnershipGuard)
    public async modifyGrade(
        @Body('grade') grade: number,
        @Param('id') userId: string,
    ) {
        await this.gradeService.gradeModify(userId, grade);
        await this.totalService.updateTotal(userId);
    }

    @ApiTags('stat')
    @Delete('grade/:id')
    @UseGuards(OwnershipGuard)
    public async deleteGrade(@Param('id') userId: string) {
        await this.gradeService.gradeDelete(userId);
        await this.totalService.updateTotal(userId);
    }

    // @Get('github/redirect')
    // public async redirect(@Query('code') code: string) {
    //     await this.githubService.redirect(code);
    // }
}
