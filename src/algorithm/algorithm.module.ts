import { Module } from '@nestjs/common';
import { AlgorithmController } from './algorithm.controller';
import { AlgorithmService } from './algorithm.service';
import { AlgorithmRepository } from './algorithm.repository';

@Module({
    controllers: [AlgorithmController],
    providers: [AlgorithmService, AlgorithmRepository],
})
export class AlgorithmModule {}
