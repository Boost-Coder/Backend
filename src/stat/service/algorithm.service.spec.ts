import { Test, TestingModule } from '@nestjs/testing';
import { AlgorithmService } from './algorithm.service';
import axios from 'axios';
import { AlgorithmRepository } from '../repository/algorithm.repository';
import { Algorithm } from '../../Entity/algorithm';
import { RankListOptionDto } from '../dto/rank-list-option.dto';

const mockAlgorithmRepository = {
    save: jest.fn(),
    findOneById: jest.fn(),
    updateAlgorithm: jest.fn(),
    deleteAlgorithm: jest.fn(),
    findAlgorithmWithRank: jest.fn(),
};

jest.mock('axios');
describe('AlgorithmService', () => {
    let service: AlgorithmService;
    let algorithmRepository;

    beforeAll(async () => {
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

        it('should throw not found error when bojId is incorrect', async function () {
            (axios.get as jest.Mock).mockRejectedValue({
                response: { status: 404 },
            });

            await expect(service.getBOJInfo('qwe')).rejects.toThrow(
                'incorrect BOJ Id',
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
            algorithm.score = 91.96000000000001;
            algorithmRepository.save.mockResolvedValue(algorithm);

            await service.createAlgorithm(userId, bojId);
            expect(mockAlgorithmRepository.save).toHaveBeenCalledWith(
                algorithm,
            );
        });

        it('백준 아이디가 없는 경우', async function () {
            (axios.get as jest.Mock).mockRejectedValue({
                response: { status: 404 },
            });
            const userId = 'user';
            const bojId = 'user';

            await expect(
                service.createAlgorithm(userId, bojId),
            ).rejects.toThrow('incorrect BOJ Id');
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
            algorithmRepository.findOneById.mockResolvedValue(new Algorithm());
            await expect(
                service.createAlgorithm(userId, bojId),
            ).rejects.toThrow('이미 등록했습니다.');
        });
    });

    describe('modifyAlgorithm', function () {
        it('should modify algorithm', async function () {
            const userId = 'user';
            const bojId = 'user1';
            const algorithm = new Algorithm();
            algorithm.userId = userId;
            algorithm.bojId = 'user2';
            algorithm.rating = 1500;
            algorithm.tier = 16;
            algorithm.solvedCount = 100;
            algorithm.score = 0;
            algorithmRepository.findOneById.mockResolvedValue(algorithm);

            const mockResponse = {
                data: {
                    rating: 1600,
                    tier: 17,
                    solvedCount: 105,
                },
            };
            (axios.get as jest.Mock).mockResolvedValue(mockResponse);
            await service.modifyAlgorithm(userId, bojId);
            const callProperty =
                algorithmRepository.updateAlgorithm.mock.calls[0][1];
            expect(callProperty.bojId).toEqual(bojId);
            expect(callProperty.rating).toEqual(mockResponse.data.rating);
            expect(callProperty.tier).toEqual(mockResponse.data.tier);
            expect(callProperty.solvedCount).toEqual(
                mockResponse.data.solvedCount,
            );
        });

        it('userId 에 해당하는 알고리즘이 없는 경우 에러', async function () {
            const userId = 'user';
            const bojId = 'user1';
            algorithmRepository.findOneById.mockResolvedValue(null);

            await expect(
                service.modifyAlgorithm(userId, bojId),
            ).rejects.toThrow('Algorithm info not found');
        });
    });

    describe('updateAlgorithm', function () {
        it('should update', async function () {
            const userId = 'user';
            const algorithm = new Algorithm();
            algorithm.userId = userId;
            algorithm.bojId = 'user1';
            algorithm.rating = 1500;
            algorithm.tier = 16;
            algorithm.solvedCount = 100;
            algorithm.score = 0;
            algorithmRepository.findOneById.mockResolvedValue(algorithm);

            const mockResponse = {
                data: {
                    rating: 1600,
                    tier: 17,
                    solvedCount: 105,
                },
            };
            (axios.get as jest.Mock).mockResolvedValue(mockResponse);
            await service.updateAlgorithm(userId);
            const callProperty =
                algorithmRepository.updateAlgorithm.mock.calls[0][1];
            expect(callProperty.rating).toEqual(mockResponse.data.rating);
            expect(callProperty.tier).toEqual(mockResponse.data.tier);
            expect(callProperty.solvedCount).toEqual(
                mockResponse.data.solvedCount,
            );
        });

        it('백준 아이디가 solved.ac에서 삭제된 경우 스탯 초기화', async function () {
            const userId = 'user';
            algorithmRepository.findOneById.mockResolvedValue(new Algorithm());
            (axios.get as jest.Mock).mockRejectedValue({
                response: { status: 404 },
            });
            await service.updateAlgorithm(userId);

            expect(algorithmRepository.deleteAlgorithm).toHaveBeenCalled();
        });
    });

    describe('removeAlgorithm', function () {
        it('should remove', async function () {
            const userId = 'user';
            algorithmRepository.findOneById.mockResolvedValue(new Algorithm());

            await service.removeAlgorithm(userId);

            expect(algorithmRepository.deleteAlgorithm).toHaveBeenCalled();
        });

        it('존재하지 않는 것을 지우려고 할 때 오류 발생', async function () {
            const userId = 'user';
            algorithmRepository.findOneById.mockResolvedValue(null);
            await expect(service.removeAlgorithm(userId)).rejects.toThrow(
                'algorithm not found',
            );
        });
    });

    describe('getAlgorithms', function () {
        it('cursor 를 하나만 보내면 오류를 던진다.', function () {
            const options1: RankListOptionDto = {
                cursorUserId: null,
                major: null,
                cursorPoint: 12,
            };
            const options2: RankListOptionDto = {
                cursorUserId: 'qwe',
                major: null,
                cursorPoint: null,
            };
            expect(service.getAlgorithms(options1)).rejects.toThrow(
                'Cursor Element Must Be Two',
            );
            expect(service.getAlgorithms(options2)).rejects.toThrow(
                'Cursor Element Must Be Two',
            );
        });
    });
});
