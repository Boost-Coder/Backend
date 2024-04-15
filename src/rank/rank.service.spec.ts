import { Test, TestingModule } from '@nestjs/testing';
import { RankService } from './rank.service';
import { GithubService } from '../stat/service/github.service';
import { AlgorithmService } from '../stat/service/algorithm.service';
import { GradeService } from '../stat/service/grade.service';
import { Github } from '../Entity/github';
import { Algorithm } from '../Entity/algorithm';
import { Grade } from '../Entity/grade';

const mockGitService = {
    findGithub: jest.fn(),
};

const mockGradeService = {
    findGrade: jest.fn(),
};

const mockAlgorithmService = {
    findAlgorithm: jest.fn(),
};

describe('RankService', () => {
    let service: RankService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RankService,
                {
                    provide: GithubService,
                    useValue: mockGitService,
                },
                {
                    provide: GradeService,
                    useValue: mockGradeService,
                },
                {
                    provide: AlgorithmService,
                    useValue: mockAlgorithmService,
                },
            ],
        }).compile();

        service = module.get<RankService>(RankService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findStat', function () {
        it('should return stat', async function () {
            const userId = 'qwe';
            const github = new Github();
            const algorithm = new Algorithm();
            const grade = new Grade();
            github.point = 123;
            algorithm.point = 123;
            grade.grade = 123;

            mockGitService.findGithub.mockResolvedValue(github);
            mockAlgorithmService.findAlgorithm.mockResolvedValue(algorithm);
            mockGradeService.findGrade.mockResolvedValue(grade);

            const result = await service.findStat(userId);
            expect(result.grade).toEqual(grade.grade);
            expect(result.githubPoint).toEqual(github.point);
            expect(result.algorithmPoint).toEqual(algorithm.point);
        });

        it('should return null if stat does not exist', async function () {
            const userId = 'qwe';
            const github = new Github();
            const algorithm = null;
            const grade = new Grade();
            github.point = 123;
            grade.grade = 123;

            mockGitService.findGithub.mockResolvedValue(github);
            mockAlgorithmService.findAlgorithm.mockResolvedValue(algorithm);
            mockGradeService.findGrade.mockResolvedValue(grade);

            const result = await service.findStat(userId);
            expect(result.grade).toEqual(grade.grade);
            expect(result.githubPoint).toEqual(github.point);
            expect(result.algorithmPoint).toEqual(null);
        });
    });
});
