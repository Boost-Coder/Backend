import {
    Body,
    Controller,
    Delete,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { AlgorithmService } from './algorithm.service';
import { CreateAlgorithmDto } from './createAlgorithm.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UserId } from '../decorator/user-id.decorator';
import { OwnershipGuard } from '../auth/guard/ownership.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/stat/algorithm')
export class AlgorithmController {
    constructor(private readonly algorithmService: AlgorithmService) {}

    @Post()
    async algorithmCreate(@Body() body: CreateAlgorithmDto, @UserId() userId) {
        await this.algorithmService.createAlgorithm(userId, body.bojId);
    }

    @UseGuards(OwnershipGuard)
    @Patch(':id')
    async algorithmModify(
        @Param('id') userId,
        @Body() body: CreateAlgorithmDto,
    ) {
        await this.algorithmService.modifyAlgorithm(userId, body.bojId);
    }

    @UseGuards(OwnershipGuard)
    @Delete(':id')
    async algorithmRemove(@Param('id') userId) {
        await this.algorithmService.removeAlgorithm(userId);
    }
}
