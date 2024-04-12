import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { StatFindDto } from './stat-find.dto';
import { RankService } from './rank.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api')
export class RankController {
    constructor(private rankService: RankService) {}

    @Get('stat/:id')
    async statFind(@Param('id') userId: string): Promise<StatFindDto> {
        return await this.rankService.findStat(userId);
    }
}
