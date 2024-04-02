import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { AlgorithmService } from './algorithm.service';
import { CreateAlgorithmDto } from './createAlgorithm.dto';

@Controller('api/stat/algorithm')
export class AlgorithmController {
    constructor(private readonly algorithmService: AlgorithmService) {}

    @Post()
    async algorithmCreate(@Body() body: CreateAlgorithmDto) {
        const userId = 'user';
        await this.algorithmService.createAlgorithm(userId, body.bojId);
    }

    @Patch(':id')
    async algorithmModify(
        @Param('id') userId,
        @Body() body: CreateAlgorithmDto,
    ) {
        await this.algorithmService.modifyAlgorithm(userId, body.bojId);
    }

    @Delete(':id')
    async algorithmRemove(@Param('id') userId) {
        await this.algorithmService.removeAlgorithm(userId);
    }
}
