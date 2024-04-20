import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { GradeRepository } from '../repository/grade.repository';
import { Grade } from '../../Entity/grade';
import { RankListDto, RankListOptionDto } from '../dto/rank-list-option.dto';
import { PointFindDto } from '../dto/rank-find.dto';

@Injectable()
export class GradeService {
    constructor(private gradeRepository: GradeRepository) {}

    async findGrade(userId: string) {
        return await this.gradeRepository.findOneById(userId);
    }

    public async gradeCreate(userId: string, grade: number) {
        const isExist = await this.gradeRepository.findOneById(userId);

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
        const isExist = await this.gradeRepository.findOneById(userId);

        if (!isExist) {
            throw new NotFoundException('등록된 학점정보가 없습니다');
        }

        const newGrade = new Grade();
        newGrade.userId = userId;
        newGrade.grade = grade;
        newGrade.point = this.calculatePoint(grade);

        await this.gradeRepository.updateGrade(newGrade);
    }

    public async gradeDelete(userId: string) {
        const isExist = await this.gradeRepository.findOneById(userId);

        if (!isExist) {
            throw new NotFoundException('등록된 학점정보가 없습니다');
        }

        await this.gradeRepository.deleteGrade(userId);
    }

    public calculatePoint(grade: number) {
        return 0;
    }

    public async getIndividualGradeRank(userId: string, options: PointFindDto) {
        return await this.gradeRepository.findIndividualRank(userId, options);
    }

    async getGradeRank(options: RankListOptionDto): Promise<[RankListDto]> {
        if (
            (options.cursorPoint && !options.cursorUserId) ||
            (!options.cursorPoint && options.cursorUserId)
        ) {
            throw new BadRequestException('Cursor Element Must Be Two');
        }
        return await this.gradeRepository.findWithRank(options);
    }
}
