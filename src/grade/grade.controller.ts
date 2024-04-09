import {
    Body,
    Controller,
    Delete,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { GradeService } from './grade.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OwnershipGuard } from '../auth/guard/ownership.guard';
import { UserId } from '../decorator/user-id.decorator';

@UseGuards(JwtAuthGuard)
@Controller('api/stat/grade')
export class GradeController {
    constructor(private readonly gradeService: GradeService) {}
    @Post()
    public async createGrade(
        @Body('grade') grade: number,
        @UserId() userId: string,
    ) {
        await this.gradeService.gradeCreate(userId, grade);
    }

    @Patch(':id')
    @UseGuards(OwnershipGuard)
    public async modifyGrade(
        @Body('grade') grade: number,
        @Param('id') userId: string,
    ) {
        await this.gradeService.gradeModify(userId, grade);
    }

    @Delete(':id')
    @UseGuards(OwnershipGuard)
    public async deleteGrade() {
        await this.gradeService.gradeDelete();
    }
}
