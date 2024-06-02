import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
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
import { Transactional } from 'typeorm-transactional';
import {
    CompareUsersDto,
    CompareUsersResponseDto,
} from './dto/compareUsers.dto';

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
        summary: '개발 역량 비교 API',
        description:
            '두 사용자의 역량을 비교한다. user1 - user2 한 결과를 반환한다. 둘중 하나라도 역량이 등록되지 않은 경우 null 반환. 가장차이나는 역량은 user1이 user2 보다 작은 역량중에서 찾아 반환한다. user1이 user2 보다 모든 역량이 크거나 같다면 null 반환',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '유저 정보 비교 성공',
        type: CompareUsersResponseDto,
    })
    @Get('compare')
    public async compareUsers(@Query() users: CompareUsersDto) {
        return await this.totalService.compareUsers(users.user1, users.user2);
    }

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
    @Transactional()
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
    @Transactional()
    async algorithmModify(
        @Param('id') userId: string,
        @Body() body: CreateAlgorithmDto,
    ) {
        await this.algorithmService.modifyAlgorithm(userId, body.bojId);
        await this.totalService.updateTotal(userId);
    }

    @ApiTags('stat')
    @ApiOperation({
        summary: '알고리즘 역량 삭제 API',
        description: '알고리즘 역량을 삭제한다.',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '알고리즘 역량 삭제 성공',
    })
    @ApiUnauthorizedResponse({
        description: 'jwt 관련 문제 (인증 시간이 만료됨, jwt를 보내지 않음)',
    })
    @ApiForbiddenResponse({
        description: '허용되지 않은 자원에 접근한 경우. 즉, 권한이 없는 경우',
    })
    @ApiNotFoundResponse({
        description:
            'user가 존재하지 않는 경우. 즉, 작업하려는 user가 존재하지 않는 경우, user에 알고리즘이 등록되지 않은 경우',
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
    })
    @UseGuards(OwnershipGuard)
    @Delete('algorithm/:id')
    @Transactional()
    async algorithmRemove(@Param('id') userId: string) {
        await this.algorithmService.removeAlgorithm(userId);
        await this.totalService.updateTotal(userId);
    }

    @ApiTags('stat')
    @ApiOperation({
        summary: '깃허브 역량 등록 API',
        description: 'github OAuth에서 얻은 access token을 등록한다. ',
    })
    @ApiBearerAuth('accessToken')
    @ApiCreatedResponse({
        description: '깃허브 역량 등록 성공',
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
    @Post('github')
    @Transactional()
    public async gitHubCreate(@Body() body: CreateGithubDto, @UserId() userId) {
        await this.githubService.createGithub(body, userId);
        await this.totalService.updateTotal(userId);
    }

    @ApiTags('stat')
    @ApiOperation({
        summary: '깃허브 역량 수정 API',
        description:
            '깃허브 access token을 수정한다. 즉 깃허브 연동 정보가 변한다.',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '깃허브 역량 수정 성공',
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
    @Patch('github/:id')
    @Transactional()
    public async gitHubModify(
        @Param('id') userId: string,
        @Body() body: CreateGithubDto,
    ) {
        await this.githubService.modifyGithub(body, userId);
        await this.totalService.updateTotal(userId);
    }

    @ApiTags('stat')
    @ApiOperation({
        summary: '깃허브 역량 삭제 API',
        description: '깃허브 역량을 삭제한다.',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '깃허브 역량 삭제 성공',
    })
    @ApiUnauthorizedResponse({
        description: 'jwt 관련 문제 (인증 시간이 만료됨, jwt를 보내지 않음)',
    })
    @ApiForbiddenResponse({
        description: '허용되지 않은 자원에 접근한 경우. 즉, 권한이 없는 경우',
    })
    @ApiNotFoundResponse({
        description:
            'user가 존재하지 않는 경우. 즉, 작업하려는 user가 존재하지 않는 경우, user에 알고리즘이 등록되지 않은 경우',
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
    })
    @UseGuards(OwnershipGuard)
    @Delete('github/:id')
    @Transactional()
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
    @Transactional()
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
    @ApiOkResponse({
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
    @Transactional()
    public async modifyGrade(
        @Body('grade') grade: number,
        @Param('id') userId: string,
    ) {
        await this.gradeService.gradeModify(userId, grade);
        await this.totalService.updateTotal(userId);
    }

    @ApiTags('stat')
    @ApiOperation({
        summary: '학점 역량 삭제 API',
        description: '학점을 삭제한다.',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '학점 역량 삭제 성공',
    })
    @ApiUnauthorizedResponse({
        description: 'jwt 관련 문제 (인증 시간이 만료됨, jwt를 보내지 않음)',
    })
    @ApiForbiddenResponse({
        description: '허용되지 않은 자원에 접근한 경우. 즉, 권한이 없는 경우',
    })
    @ApiNotFoundResponse({
        description:
            'user가 존재하지 않는 경우. 즉, 작업하려는 user가 존재하지 않는 경우, user에 학점이 등록되지 않은 경우',
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
    })
    @Delete('grade/:id')
    @UseGuards(OwnershipGuard)
    @Transactional()
    public async deleteGrade(@Param('id') userId: string) {
        await this.gradeService.gradeDelete(userId);
        await this.totalService.updateTotal(userId);
    }

    // @Get('github/redirect')
    // public async redirect(@Query('code') code: string) {
    //     await this.githubService.redirect(code);
    // }
}
