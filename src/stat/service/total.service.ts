import { BadRequestException, Injectable } from '@nestjs/common';
import { TotalRepository } from '../repository/total.repository';
import { TotalPoint } from '../../Entity/totalPoint';
import { GithubService } from './github.service';
import { AlgorithmService } from './algorithm.service';
import { GradeService } from './grade.service';
import { Github } from '../../Entity/github';
import { Grade } from '../../Entity/grade';
import { Algorithm } from '../../Entity/algorithm';
import { RankListDto, RankListOptionDto } from '../dto/rank-list-option.dto';
import { PointFindDto } from '../dto/rank-find.dto';
import { StatFindDto } from '../dto/stat-find.dto';

@Injectable()
export class TotalService {
    constructor(
        private totalRepository: TotalRepository,
        private githubService: GithubService,
        private algorithmService: AlgorithmService,
        private gradeService: GradeService,
    ) {}

    async findStat(userId: string): Promise<StatFindDto> {
        const github = await this.githubService.findGithub(userId);
        const algorithm = await this.algorithmService.findAlgorithm(userId);
        const grade = await this.gradeService.findGrade(userId);
        const total = await this.totalRepository.findOneById(userId);

        return {
            githubPoint: github ? github.point : null,
            algorithmPoint: algorithm ? algorithm.point : null,
            grade: grade ? grade.grade : null,
            totalPoint: grade ? total.point : null,
        };
    }

    async getTotalRank(options: RankListOptionDto): Promise<[RankListDto]> {
        if (
            (options.cursorPoint && !options.cursorUserId) ||
            (!options.cursorPoint && options.cursorUserId)
        ) {
            throw new BadRequestException('Cursor Element Must Be Two');
        }
        return await this.totalRepository.findWithRank(options);
    }

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
        await this.totalRepository.updateTotal(total, userId);
    }

    calculateTotalPoint(github: Github, algorithm: Algorithm, grade: Grade) {
        return 0;
    }

    public async getIndividualTotalRank(userId: string, options: PointFindDto) {
        return await this.totalRepository.findIndividualRank(userId, options);
    }
}
