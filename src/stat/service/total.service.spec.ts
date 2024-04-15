import { Test, TestingModule } from '@nestjs/testing';
import { TotalService } from './total.service';
import { TotalRepository } from '../repository/total.repository';
import { User } from '../../Entity/user';
import { GithubService } from './github.service';
import { GradeService } from './grade.service';
import { AlgorithmService } from './algorithm.service';

const mockTotalRepository = {
    save: jest.fn(),
    findOneById: jest.fn(),
    update: jest.fn(),
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
});
