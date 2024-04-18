import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AlgorithmService } from './service/algorithm.service';
import { RankListOptionDto } from './dto/rank-list-option.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/rank')
export class RankController {
    constructor(private algorithmService: AlgorithmService) {}
    @Get('algorithm')
    async findAlgorithmRank(@Query() options: RankListOptionDto) {
        return await this.algorithmService.getAlgorithms(options);
    }

    @Get('/users/:id')
    async findUsersRank(@Param('id') userId) {}
}
