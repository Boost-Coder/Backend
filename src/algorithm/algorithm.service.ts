import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { AlgorithmRepository } from './algorithm.repository';
import { Algorithm } from '../Entity/algorithm';

const URL = 'https://solved.ac/api/v3/user/show?handle=';

export interface BOJInfo {
    tier: number;
    solvedCount: number;
    rating: number;
}
@Injectable()
export class AlgorithmService {
    constructor(private algorithmRepository: AlgorithmRepository) {}
    async createAlgorithm(userId: string, bojId: string) {
        const bojInfo = await this.getBOJInfo(bojId);
        const algorithm: Algorithm = new Algorithm();
        algorithm.userId = userId;
        algorithm.bojId = bojId;
        algorithm.rating = bojInfo.rating;
        algorithm.tier = bojInfo.tier;
        algorithm.solvedCount = bojInfo.solvedCount;
        algorithm.point = this.calculatePoint(bojInfo);
        await this.algorithmRepository.save(algorithm);
    }
    async getBOJInfo(bojId: string) {
        try {
            const res = await axios.get(URL + bojId);
            const bojInfo = res.data;
            return {
                rating: bojInfo.rating,
                tier: bojInfo.tier,
                solvedCount: bojInfo.solvedCount,
            };
        } catch (e) {
            throw new Error('BOJ ID Not Found');
        }
    }

    private calculatePoint(bojInfo: BOJInfo) {
        return 0;
    }
}
