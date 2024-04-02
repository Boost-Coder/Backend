import {
    BadRequestException,
    HttpException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { AlgorithmRepository } from './algorithm.repository';
import { Algorithm } from '../Entity/algorithm';
import { QueryFailedError } from 'typeorm';
import { NotFoundError } from 'rxjs';

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
        const isExist = await this.algorithmRepository.findOneById(userId);
        if (isExist) {
            throw new BadRequestException('이미 등록했습니다.');
        }
        const algorithm: Algorithm = new Algorithm();
        algorithm.userId = userId;
        algorithm.bojId = bojId;
        algorithm.rating = bojInfo.rating;
        algorithm.tier = bojInfo.tier;
        algorithm.solvedCount = bojInfo.solvedCount;
        algorithm.point = this.calculatePoint(bojInfo);
        await this.algorithmRepository.save(algorithm);
    }

    async updateAlgorithm(userId: string) {
        const algorithm = await this.algorithmRepository.findOneById(userId);
        if (algorithm === null) {
            throw new NotFoundError('Algorithm info not found');
        }
        const bojInfo = await this.getBOJInfo(algorithm.bojId);
        algorithm.tier = bojInfo.tier;
        algorithm.rating = bojInfo.rating;
        algorithm.solvedCount = bojInfo.solvedCount;
        algorithm.point = this.calculatePoint(bojInfo);
        await this.algorithmRepository.update(userId, algorithm);
    }

    async modifyAlgorithm(userId: string, bojId: string) {
        const algorithm = await this.algorithmRepository.findOneById(userId);
        if (algorithm === null) {
            throw new NotFoundException('Algorithm info not found');
        }
        const bojInfo = await this.getBOJInfo(bojId);
        algorithm.bojId = bojId;
        algorithm.tier = bojInfo.tier;
        algorithm.rating = bojInfo.rating;
        algorithm.solvedCount = bojInfo.solvedCount;
        algorithm.point = this.calculatePoint(bojInfo);
        await this.algorithmRepository.update(userId, algorithm);
    }

    async removeAlgorithm(userId: string) {
        const isExist = await this.algorithmRepository.findOneById(userId);
        if (!isExist) {
            throw new NotFoundException('algorithm not found');
        }
        await this.algorithmRepository.delete(userId);
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
            if (e.response && e.response.status === 404) {
                throw new BadRequestException('incorrect BOJ Id');
            } else {
                throw e;
            }
        }
    }

    private calculatePoint(bojInfo: BOJInfo) {
        return 0;
    }
}
