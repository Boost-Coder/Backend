import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RankListOptionDto } from './rank-list-option.dto';
import { AlgorithmService } from '../stat/service/algorithm.service';

@UseGuards(JwtAuthGuard)
@Controller('api/rank')
export class RankController {
    constructor(private algorithmService: AlgorithmService) {}
    @Get('algorithm')
    async findAlgorithmRank(@Query() options: RankListOptionDto) {
        return await this.algorithmService.getAlgorithms(options);
    }
}
