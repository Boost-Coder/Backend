import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { RankListOptionDto } from './rank-list-option.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/rank')
export class RankController {
    @Get('algorithm')
    findAll(@Query() options: RankListOptionDto) {
        return {};
    }
}
