import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import axios from 'axios';
import { AlgorithmRepository } from '../repository/algorithm.repository';
import { Algorithm } from '../../Entity/algorithm';
import { NotFoundError } from 'rxjs';
import { RankListDto, RankListOptionDto } from '../dto/rank-list-option.dto';
import { PointFindDto } from '../dto/rank-find.dto';

const URL = 'https://solved.ac/api/v3/user/show?handle=';

export interface BOJInfo {
    tier: number;
    solvedCount: number;
    rating: number;
}
@Injectable()
export class AlgorithmService {
    private logger = new Logger(AlgorithmService.name);
    constructor(private algorithmRepository: AlgorithmRepository) {}
    async findAlgorithm(userId: string) {
        return await this.algorithmRepository.findOneById(userId);
    }

    async getAlgorithms(options: RankListOptionDto): Promise<[RankListDto]> {
        if (
            (options.cursorPoint && !options.cursorUserId) ||
            (!options.cursorPoint && options.cursorUserId)
        ) {
            throw new BadRequestException('Cursor Element Must Be Two');
        }
        return await this.algorithmRepository.findWithRank(options);
    }

    async createAlgorithm(userId: string, bojId: string) {
        const bojInfo = await this.getBOJInfo(bojId);
        const isExist = await this.algorithmRepository.findOneById(userId);
        if (isExist) {
            throw new ConflictException('이미 등록했습니다.');
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
        try {
            const bojInfo = await this.getBOJInfo(algorithm.bojId);
            algorithm.tier = bojInfo.tier;
            algorithm.rating = bojInfo.rating;
            algorithm.solvedCount = bojInfo.solvedCount;
            algorithm.point = this.calculatePoint(bojInfo);
            await this.algorithmRepository.updateAlgorithm(userId, algorithm);
        } catch (e) {
            if (e instanceof BadRequestException) {
                await this.removeAlgorithm(userId);
                this.logger.warn(`${userId} 님의 알고리즘 스탯이 초기화됨.`);
            } else {
                throw e;
            }
        }
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
        await this.algorithmRepository.updateAlgorithm(userId, algorithm);
    }

    async removeAlgorithm(userId: string) {
        const isExist = await this.algorithmRepository.findOneById(userId);
        if (!isExist) {
            throw new NotFoundException('algorithm not found');
        }
        await this.algorithmRepository.deleteAlgorithm(userId);
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

    public async getIndividualAlgorithmRank(
        userId: string,
        options: PointFindDto,
    ) {
        return await this.algorithmRepository.findIndividualRank(
            userId,
            options,
        );
    }
}
