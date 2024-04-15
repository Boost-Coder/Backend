import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { GradeRepository } from '../repository/grade.repository';
import { Grade } from '../../Entity/grade';

@Injectable()
export class GradeService {
    constructor(private gradeRepository: GradeRepository) {}

    async findGrade(userId: string) {
        return await this.gradeRepository.findOne(userId);
    }

    public async gradeCreate(userId: string, grade: number) {
        const isExist = await this.gradeRepository.findOne(userId);

        if (isExist) {
            throw new BadRequestException('이미 등록했습니다.');
        }
        const newGrade = new Grade();
        newGrade.userId = userId;
        newGrade.grade = grade;
        newGrade.point = this.calculatePoint(grade);

        await this.gradeRepository.save(newGrade);
    }

    public async gradeModify(userId: string, grade: number) {
        const isExist = await this.gradeRepository.findOne(userId);

        if (!isExist) {
            throw new NotFoundException('등록된 학점정보가 없습니다');
        }

        const newGrade = new Grade();
        newGrade.userId = userId;
        newGrade.grade = grade;
        newGrade.point = this.calculatePoint(grade);

        await this.gradeRepository.update(newGrade);
    }

    public async gradeDelete(userId: string) {
        const isExist = await this.gradeRepository.findOne(userId);

        if (!isExist) {
            throw new NotFoundException('등록된 학점정보가 없습니다');
        }

        await this.gradeRepository.delete(userId);
    }

    public calculatePoint(grade: number) {
        return 0;
    }
}
