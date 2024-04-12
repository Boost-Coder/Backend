import { Injectable } from '@nestjs/common';
import { GithubService } from '../github/github.service';
import { AlgorithmService } from '../algorithm/algorithm.service';
import { GradeService } from '../grade/grade.service';

@Injectable()
export class RankService {
    constructor(
        private githubService: GithubService,
        private algorithmService: AlgorithmService,
        private gradeService: GradeService,
    ) {}

    async findStat(userId: string) {
        const github = await this.githubService.findGithub(userId);
        const algorithm = await this.algorithmService.findAlgorithm(userId);
        const grade = await this.gradeService.findGrade(userId);

        return {
            githubPoint: github ? github.point : null,
            algorithmPoint: algorithm ? algorithm.point : null,
            grade: grade ? grade.grade : null,
        };
    }
}
