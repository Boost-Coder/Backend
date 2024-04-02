import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { AlgorithmRepository } from './algorithm.repository';
import { Algorithm } from '../Entity/algorithm';
import { QueryFailedError } from 'typeorm';

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
        try {
            await this.algorithmRepository.save(algorithm);
        } catch (e) {
            if (
                e instanceof QueryFailedError &&
                e.message.includes('Duplicate entry')
            ) {
                throw new BadRequestException('이미 등록했습니다.');
            } else {
                throw e;
            }
        }
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
            throw new BadRequestException('incorrect BOJ Id');
        }
    }

    private calculatePoint(bojInfo: BOJInfo) {
        return 0;
    }
}
