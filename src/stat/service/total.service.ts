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
import { CompareUsersResponseDto } from '../dto/compareUsers.dto';

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
            githubPoint: github ? github.score : null,
            algorithmPoint: algorithm ? algorithm.score : null,
            grade: grade ? grade.grade : null,
            totalPoint: grade ? total.score : null,
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
        totalPoint.score = 0;

        await this.totalRepository.save(totalPoint);
    }

    async updateTotal(userId) {
        const github = await this.githubService.findGithub(userId);
        const algorithm = await this.algorithmService.findAlgorithm(userId);
        const grade = await this.gradeService.findGrade(userId);
        const total = new TotalPoint();
        total.score = this.calculateTotalPoint(github, algorithm, grade);
        await this.totalRepository.updateTotal(total, userId);
    }

    calculateTotalPoint(github: Github, algorithm: Algorithm, grade: Grade) {
        const [GRADE_WEIGHT, ALGORITHM_WEIGHT, GITHUB_WEIGHT] = [1, 4, 4];
        const TOTAL_WEIGHT = GRADE_WEIGHT + ALGORITHM_WEIGHT + GITHUB_WEIGHT;
        const githubPoint = github == null ? 0 : github.score;
        const algorithmPoint = algorithm == null ? 0 : algorithm.score;
        const gradePoint = grade == null ? 0 : grade.score;
        const totalPoint =
            (githubPoint * GITHUB_WEIGHT +
                algorithmPoint * ALGORITHM_WEIGHT +
                gradePoint * GRADE_WEIGHT) /
            TOTAL_WEIGHT;
        return totalPoint;
    }

    public async getIndividualTotalRank(userId: string, options: PointFindDto) {
        return await this.totalRepository.findIndividualRank(userId, options);
    }

    public async compareUsers(user1: string, user2: string) {
        const comparison = new CompareUsersResponseDto();
        [
            comparison.algorithmScoreDifference,
            comparison.algorithmRankDifference,
        ] = await this.compareAlgorithm(user1, user2);

        [comparison.githubScoreDifference, comparison.githubRankDifference] =
            await this.compareGithub(user1, user2);

        [comparison.gradeScoreDifference, comparison.gradeRankDifference] =
            await this.compareGrade(user1, user2);

        [comparison.totalScoreDifference, comparison.totalRankDifference] =
            await this.compareTotal(user1, user2);

        comparison.mostSignificantScoreDifferenceStat =
            this.findMaxScoreDifference(comparison);
        return comparison;
    }

    findMaxScoreDifference(response: CompareUsersResponseDto): string | null {
        const scoreDifferences = {
            algorithm: response.algorithmScoreDifference,
            github: response.githubScoreDifference,
            grade: response.gradeScoreDifference,
        };

        let maxDifference = 0;
        let maxDifferenceKey: string | null = null;

        for (const [key, value] of Object.entries(scoreDifferences)) {
            if (value !== null && value < 0 && value < maxDifference) {
                maxDifference = value;
                maxDifferenceKey = key;
            }
        }

        return maxDifferenceKey;
    }

    private async compareGithub(user1: string, user2: string) {
        const githubScoreDifference = await this.compareGithubScore(
            user1,
            user2,
        );
        if (githubScoreDifference === null) {
            return [null, null];
        }
        const githubRankDifference = await this.compareGithubRank(user1, user2);
        return [githubScoreDifference, githubRankDifference];
    }

    private async compareGithubScore(user1: string, user2: string) {
        const user1Github = await this.githubService.findGithub(user1);
        const user2Github = await this.githubService.findGithub(user2);
        if (user1Github == null || user2Github == null) {
            return null;
        }
        return this.roundSecond(user1Github.score - user2Github.score);
    }

    private async compareGithubRank(user1: string, user2: string) {
        const user1Rank = await this.githubService.getIndividualGithubRank(
            user1,
            new PointFindDto(),
        );
        const user2Rank = await this.githubService.getIndividualGithubRank(
            user2,
            new PointFindDto(),
        );
        return user1Rank.rank - user2Rank.rank;
    }

    private async compareAlgorithm(user1: string, user2: string) {
        const algorithmScoreDifference = await this.compareAlgorithmScore(
            user1,
            user2,
        );
        if (algorithmScoreDifference === null) {
            return [null, null];
        }
        const algorithmRankDifference = await this.compareAlgorithmRank(
            user1,
            user2,
        );
        return [algorithmScoreDifference, algorithmRankDifference];
    }

    private async compareAlgorithmScore(user1: string, user2: string) {
        const user1Algorithm = await this.algorithmService.findAlgorithm(user1);
        const user2Algorithm = await this.algorithmService.findAlgorithm(user2);
        if (user1Algorithm == null || user2Algorithm == null) {
            return null;
        }
        return this.roundSecond(user1Algorithm.score - user2Algorithm.score);
    }

    private async compareAlgorithmRank(user1: string, user2: string) {
        const user1Rank =
            await this.algorithmService.getIndividualAlgorithmRank(
                user1,
                new PointFindDto(),
            );
        const user2Rank =
            await this.algorithmService.getIndividualAlgorithmRank(
                user2,
                new PointFindDto(),
            );
        return user1Rank.rank - user2Rank.rank;
    }

    private async compareGrade(user1: string, user2: string) {
        const gradeScoreDifference = await this.compareGradeScore(user1, user2);
        if (gradeScoreDifference === null) {
            return [null, null];
        }
        const gradeRankDifference = await this.compareGradeRank(user1, user2);
        return [gradeScoreDifference, gradeRankDifference];
    }

    private async compareGradeScore(user1: string, user2: string) {
        const user1Grade = await this.gradeService.findGrade(user1);
        const user2Grade = await this.gradeService.findGrade(user2);
        if (user1Grade == null || user2Grade == null) {
            return null;
        }
        return this.roundSecond(user1Grade.score - user2Grade.score);
    }

    private async compareGradeRank(user1: string, user2: string) {
        const user1Rank = await this.gradeService.getIndividualGradeRank(
            user1,
            new PointFindDto(),
        );
        const user2Rank = await this.gradeService.getIndividualGradeRank(
            user2,
            new PointFindDto(),
        );
        return user1Rank.rank - user2Rank.rank;
    }

    private async compareTotal(user1: string, user2: string) {
        const totalScoreDifference = await this.compareTotalScore(user1, user2);
        if (totalScoreDifference === null) {
            return [null, null];
        }
        const totalRankDifference = await this.compareTotalRank(user1, user2);
        return [totalScoreDifference, totalRankDifference];
    }

    private async compareTotalScore(user1: string, user2: string) {
        const user1Total = await this.totalRepository.findOneById(user1);
        const user2Total = await this.totalRepository.findOneById(user2);
        if (user1Total == null || user2Total == null) {
            return null;
        }
        return this.roundSecond(user1Total.score - user2Total.score);
    }

    private async compareTotalRank(user1: string, user2: string) {
        const user1Rank = await this.getIndividualTotalRank(
            user1,
            new PointFindDto(),
        );
        const user2Rank = await this.getIndividualTotalRank(
            user2,
            new PointFindDto(),
        );
        return user1Rank.rank - user2Rank.rank;
    }

    private roundSecond(number) {
        return Math.round(number * 100) / 100;
    }
}
