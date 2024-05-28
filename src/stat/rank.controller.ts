import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AlgorithmService } from './service/algorithm.service';
import { RankListDto, RankListOptionDto } from './dto/rank-list-option.dto';
import { GithubService } from './service/github.service';
import { GradeService } from './service/grade.service';
import { TotalService } from './service/total.service';
import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { PointFindDto, RankFindDto } from './dto/rank-find.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/rank')
export class RankController {
    constructor(
        private readonly algorithmService: AlgorithmService,
        private readonly githubService: GithubService,
        private readonly gradeService: GradeService,
        private readonly totalService: TotalService,
        private readonly userService: UserService,
    ) {}
    @Get('algorithm')
    @ApiTags('rank')
    @ApiOperation({
        summary: '알고리즘 전체 랭킹 API',
        description:
            '알고리즘 역량의 랭킹리스트를 반환한다. 페이지네이션이 가능하고 학과 별로 필터링 가능하다. (학번 필터링은 아직 미구현) 커서 사용시 cursorPoint, cursorUserId 두개를 동시에 넣어야한다. 각각 마지막으로 받은 유저의 점수와 유저 아이디이다.',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '알고리즘 랭킹 반환',
        type: [RankListDto],
    })
    @ApiUnauthorizedResponse({
        description: 'jwt 관련 문제 (인증 시간이 만료됨, jwt를 보내지 않음)',
    })
    @ApiForbiddenResponse({
        description: '허용되지 않은 자원에 접근한 경우. 즉, 권한이 없는 경우',
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
    })
    async findAlgorithmRank(@Query() options: RankListOptionDto) {
        return await this.algorithmService.getAlgorithms(options);
    }

    @Get('github')
    @ApiTags('rank')
    @ApiOperation({
        summary: '깃허브 전체 랭킹 API',
        description:
            '깃허브 역량의 랭킹리스트를 반환한다. 페이지네이션이 가능하고 학과 별로 필터링 가능하다. (학번 필터링은 아직 미구현) 커서 사용시 cursorPoint, cursorUserId 두개를 동시에 넣어야한다. 각각 마지막으로 받은 유저의 점수와 유저 아이디이다.',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '깃허브 랭킹 반환',
        type: [RankListDto],
    })
    @ApiUnauthorizedResponse({
        description: 'jwt 관련 문제 (인증 시간이 만료됨, jwt를 보내지 않음)',
    })
    @ApiForbiddenResponse({
        description: '허용되지 않은 자원에 접근한 경우. 즉, 권한이 없는 경우',
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
    })
    async findGithubRank(@Query() options: RankListOptionDto) {
        return await this.githubService.getGithubRank(options);
    }

    @Get('grade')
    @ApiTags('rank')
    @ApiOperation({
        summary: '학점 전체 랭킹 API',
        description:
            '학점 역량의 랭킹리스트를 반환한다. 페이지네이션이 가능하고 학과 별로 필터링 가능하다. (학번 필터링은 아직 미구현) 커서 사용시 cursorPoint, cursorUserId 두개를 동시에 넣어야한다. 각각 마지막으로 받은 유저의 점수와 유저 아이디이다.',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '깃허브 랭킹 반환',
        type: [RankListDto],
    })
    @ApiUnauthorizedResponse({
        description: 'jwt 관련 문제 (인증 시간이 만료됨, jwt를 보내지 않음)',
    })
    @ApiForbiddenResponse({
        description: '허용되지 않은 자원에 접근한 경우. 즉, 권한이 없는 경우',
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
    })
    async findGradeRank(@Query() options: RankListOptionDto) {
        return await this.gradeService.getGradeRank(options);
    }

    @Get('total')
    @ApiTags('rank')
    @ApiOperation({
        summary: '종합 전체 랭킹 API',
        description:
            '학점 역량의 랭킹리스트를 반환한다. 페이지네이션이 가능하고 학과 별로 필터링 가능하다. (학번 필터링은 아직 미구현) 커서 사용시 cursorPoint, cursorUserId 두개를 동시에 넣어야한다. 각각 마지막으로 받은 유저의 점수와 유저 아이디이다.',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '종합 랭킹 반환',
        type: [RankListDto],
    })
    @ApiUnauthorizedResponse({
        description: 'jwt 관련 문제 (인증 시간이 만료됨, jwt를 보내지 않음)',
    })
    @ApiForbiddenResponse({
        description: '허용되지 않은 자원에 접근한 경우. 즉, 권한이 없는 경우',
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
    })
    async findTotalRank(@Query() options: RankListOptionDto) {
        const a = await this.totalService.getTotalRank(options);
        console.log(a);
        return a;
    }

    @ApiTags('rank')
    @ApiOperation({
        summary: '유저의 각 부문 별 랭킹 API',
        description:
            '만약 유저가 해당 전공이 아니면 전부 null 로 반환한다 , 등록하지 않은 부문이 있는 경우도 null 로 반환',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '유저의 부문별 랭킹 반환',
        type: RankFindDto,
    })
    @ApiUnauthorizedResponse({
        description: 'jwt 관련 문제 (인증 시간이 만료됨, jwt를 보내지 않음)',
    })
    @ApiForbiddenResponse({
        description: '허용되지 않은 자원에 접근한 경우. 즉, 권한이 없는 경우',
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
    })
    @Get('/users/:id')
    async findUsersRank(
        @Param('id') userId: string,
        @Query() options: PointFindDto,
    ) {
        const user = await this.userService.findUserByUserId(userId);

        if (options.major && user.major !== options.major) {
            return new RankFindDto(null, null, null, null);
        } else {
            const algorithmRank =
                await this.algorithmService.getIndividualAlgorithmRank(
                    userId,
                    options,
                );

            const githubRank = await this.githubService.getIndividualGithubRank(
                userId,
                options,
            );

            const gradeRank = await this.gradeService.getIndividualGradeRank(
                userId,
                options,
            );

            const totalRank = await this.totalService.getIndividualTotalRank(
                userId,
                options,
            );
            return new RankFindDto(
                totalRank ? totalRank.rank : null,
                algorithmRank ? algorithmRank.rank : null,
                githubRank ? githubRank.rank : null,
                gradeRank ? gradeRank.rank : null,
            );
        }
    }
}
