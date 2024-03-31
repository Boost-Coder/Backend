import { Test, TestingModule } from '@nestjs/testing';
import { AlgorithmService } from './algorithm.service';
import axios from 'axios';

jest.mock('axios');
describe('AlgorithmService', () => {
    let service: AlgorithmService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AlgorithmService],
        }).compile();

        service = module.get<AlgorithmService>(AlgorithmService);
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
});
