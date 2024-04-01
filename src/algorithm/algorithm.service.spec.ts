import { Test, TestingModule } from '@nestjs/testing';
import { AlgorithmService } from './algorithm.service';
import axios from 'axios';
import { AlgorithmRepository } from './algorithm.repository';
import { Algorithm } from '../Entity/algorithm';
import { QueryFailedError } from 'typeorm';

const mockAlgorithmRepository = {
    save: jest.fn(),
};

jest.mock('axios');
describe('AlgorithmService', () => {
    let service: AlgorithmService;
    let algorithmRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AlgorithmService,
                {
                    provide: AlgorithmRepository,
                    useValue: mockAlgorithmRepository,
                },
            ],
        }).compile();

        service = module.get<AlgorithmService>(AlgorithmService);
        algorithmRepository = module.get(AlgorithmRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getBOJInfo', function () {
        it('should return boj info', async function () {
            const mockResponse = {
                data: {
                    rating: 1500,
                    tier: 16,
                    solvedCount: 100,
                },
            };
            (axios.get as jest.Mock).mockResolvedValue(mockResponse);

            const res = await service.getBOJInfo('userId');

            expect(res.solvedCount).toEqual(100);
            expect(res.rating).toEqual(1500);
            expect(res.tier).toEqual(16);
        });

        it('should throw not found error', async function () {
            (axios.get as jest.Mock).mockRejectedValue(
                new Error('Failed to fetch'),
            );

            await expect(service.getBOJInfo('qwe')).rejects.toThrow(
                'BOJ ID Not Found',
            );
        });
    });

    describe('createAlgorithm', function () {
        it('should create algorithm', async function () {
            const mockResponse = {
                data: {
                    rating: 1500,
                    tier: 16,
                    solvedCount: 100,
                },
            };
            (axios.get as jest.Mock).mockResolvedValue(mockResponse);
            const userId = 'user';
            const bojId = 'user';
            const algorithm = new Algorithm();
            algorithm.userId = userId;
            algorithm.bojId = bojId;
            algorithm.rating = mockResponse.data.rating;
            algorithm.tier = mockResponse.data.tier;
            algorithm.solvedCount = mockResponse.data.solvedCount;
            algorithm.point = 0;
            algorithmRepository.save.mockResolvedValue(algorithm);

            await service.createAlgorithm(userId, bojId);
            expect(mockAlgorithmRepository.save).toHaveBeenCalledWith(
                algorithm,
            );
        });

        it('백준 아이디가 없는 경우', async function () {
            (axios.get as jest.Mock).mockRejectedValue(
                new Error('Failed to fetch'),
            );
            const userId = 'user';
            const bojId = 'user';

            await expect(
                service.createAlgorithm(userId, bojId),
            ).rejects.toThrow('BOJ ID Not Found');
        });

        it('중복으로 등록하는 경우', async function () {
            const mockResponse = {
                data: {
                    rating: 1500,
                    tier: 16,
                    solvedCount: 100,
                },
            };
            (axios.get as jest.Mock).mockResolvedValue(mockResponse);
            const userId = 'user';
            const bojId = 'user';
            algorithmRepository.save.mockRejectedValue(
                new QueryFailedError(
                    'insert',
                    [],
                    new Error('Duplicate entry error'),
                ),
            );
            await expect(
                service.createAlgorithm(userId, bojId),
            ).rejects.toThrow('이미 등록했습니다.');
        });
    });
});
