import { Body, Controller, Post } from '@nestjs/common';
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
}
