import { Test, TestingModule } from '@nestjs/testing';
import { TotalService } from './total.service';
import { TotalRepository } from '../repository/total.repository';
import { User } from '../../Entity/user';
import { GithubService } from './github.service';
import { GradeService } from './grade.service';
import { AlgorithmService } from './algorithm.service';
import { Github } from '../../Entity/github';
import { Algorithm } from '../../Entity/algorithm';
import { Grade } from '../../Entity/grade';

const mockTotalRepository = {
    save: jest.fn(),
    findOneById: jest.fn(),
    updateTotal: jest.fn(),
};

const mockGitService = {
    findGithub: jest.fn(),
};

const mockGradeService = {
    findGrade: jest.fn(),
};

const mockAlgorithmService = {
    findAlgorithm: jest.fn(),
};
describe('TotalService', () => {
    let service: TotalService;
    let repository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TotalService,
                { provide: TotalRepository, useValue: mockTotalRepository },
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

        service = module.get<TotalService>(TotalService);
        repository = module.get(TotalRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createTotalPoint', function () {
        it('should create TotalPoint', async function () {
            const userId = 'user';
            repository.findOneById.mockResolvedValue(null);

            await service.createTotalPoint(userId);

            expect(repository.save).toHaveBeenCalled();
        });

        it('중복 등록시 에러', function () {
            const userId = 'user';
            repository.findOneById.mockResolvedValue(new User());
            expect(service.createTotalPoint(userId)).rejects.toThrow(
                '이미 등록했습니다.',
            );
        });
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
