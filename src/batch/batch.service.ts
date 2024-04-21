import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UserService } from '../user/user.service';
import { AlgorithmService } from '../stat/service/algorithm.service';
import { GithubService } from '../stat/service/github.service';
import { TotalService } from '../stat/service/total.service';

@Injectable()
export class BatchService {
    private readonly logger = new Logger(BatchService.name);
    constructor(
        private userService: UserService,
        private algorithmService: AlgorithmService,
        private githubService: GithubService,
        private totalService: TotalService,
    ) {}
    @Cron('40 * * * * *')
    async updateAllUserStat() {
        const users = await this.userService.getUsers();
        for (const user of users) {
            await this.algorithmService.updateAlgorithm(user.userId);
            await this.totalService.updateTotal(user.userId);
            this.logger.log(`${user.userId}의 역량 업데이트`);
        }
    }
}
