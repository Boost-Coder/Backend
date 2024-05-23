import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Grade } from '../../Entity/grade';
import { StatRepository } from '../../utils/stat.repository';

@Injectable()
export class GradeRepository extends StatRepository {
    constructor(dataSource: DataSource) {
        super(dataSource, Grade);
    }

    public async findOneById(id: string) {
        return await this.findOneBy({ userId: id });
    }

    public async updateGrade(newGrade: Grade) {
        return await this.update(
            { userId: newGrade.userId },
            {
                grade: newGrade.grade,
                point: newGrade.score,
            },
        );
    }

    public async deleteGrade(id: string) {
        await this.delete({ userId: id });
    }
}
