import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserId } from '../decorator/user-id.decorator';
import { RankService } from './rank.service';

@UseGuards(JwtAuthGuard)
@Controller('api/rank')
export class RankController {
    constructor(private rankService: RankService) {}
    @Get('users/:id')
    public async getUserRank(@UserId() userId: string) {}
}
