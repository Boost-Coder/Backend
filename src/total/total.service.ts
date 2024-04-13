import { BadRequestException, Injectable } from '@nestjs/common';
import { TotalRepository } from './total.repository';
import { TotalPoint } from '../Entity/totalPoint';
import { GithubService } from '../github/github.service';
import { AlgorithmService } from '../algorithm/algorithm.service';
import { GradeService } from '../grade/grade.service';
import { Github } from '../Entity/github';
import { Grade } from '../Entity/grade';
import { Algorithm } from '../Entity/algorithm';

@Injectable()
export class TotalService {
    constructor(
        private totalRepository: TotalRepository,
        private githubService: GithubService,
        private algorithmService: AlgorithmService,
        private gradeService: GradeService,
    ) {}
    async createTotalPoint(userId: string) {
        const isExist = await this.totalRepository.findOneById(userId);

        if (isExist) {
            throw new BadRequestException('이미 등록했습니다.');
        }
        const totalPoint = new TotalPoint();
        totalPoint.userId = userId;
        totalPoint.point = 0;

        await this.totalRepository.save(totalPoint);
    }

    async updateTotal(userId) {
        const github = await this.githubService.findGithub(userId);
        const algorithm = await this.algorithmService.findAlgorithm(userId);
        const grade = await this.gradeService.findGrade(userId);
        const total = new TotalPoint();
        total.point = this.calculateTotalPoint(github, algorithm, grade);
        await this.totalRepository.update(total, userId);
    }

    calculateTotalPoint(github: Github, algorithm: Algorithm, grade: Grade) {
        return 0;
    }
}
