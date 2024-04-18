import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AlgorithmService } from './service/algorithm.service';
import { RankListOptionDto } from './dto/rank-list-option.dto';
import { GithubService } from './service/github.service';
import { GradeService } from './service/grade.service';
import { TotalService } from './service/total.service';

@UseGuards(JwtAuthGuard)
@Controller('api/rank')
export class RankController {
    constructor(
        private readonly algorithmService: AlgorithmService,
        private readonly githubService: GithubService,
        private readonly gradeService: GradeService,
        private readonly totalService: TotalService,
    ) {}
    @Get('algorithm')
    async findAlgorithmRank(@Query() options: RankListOptionDto) {
        return await this.algorithmService.getAlgorithms(options);
    }

    @Get('/users/:id')
    async findUsersRank(
        @Param('id') userId,
        @Query() options: RankListOptionDto,
    ) {
        const algorithmRank =
            await this.algorithmService.getIndividualAlgorithmRank(
                userId,
                options,
            );

        return { algorithm: algorithmRank.rank };
    }
}
