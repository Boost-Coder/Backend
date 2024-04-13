import { BadRequestException, Injectable } from '@nestjs/common';
import { TotalRepository } from './total.repository';
import { TotalPoint } from '../Entity/totalPoint';

@Injectable()
export class TotalService {
    constructor(private totalRepository: TotalRepository) {}
    async createTotalPoint(userId: string) {
        const isExist = await this.totalRepository.findOne(userId);

        if (isExist) {
            throw new BadRequestException('이미 등록했습니다.');
        }
        const totalPoint = new TotalPoint();
        totalPoint.userId = userId;
        totalPoint.point = 0;

        await this.totalRepository.save(totalPoint);
    }
}
