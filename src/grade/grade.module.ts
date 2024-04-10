import { Module } from '@nestjs/common';
import { GradeService } from './grade.service';
import { GradeRepository } from './grade.repository';
import { GradeController } from './grade.controller';

@Module({
    providers: [GradeService, GradeRepository],
    controllers: [GradeController],
    exports: [GradeService],
})
export class GradeModule {}
