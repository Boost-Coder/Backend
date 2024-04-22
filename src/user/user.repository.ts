import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from '../Entity/user';

@Injectable()
export class UserRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async findOneByProviderId(providerId: string) {
        return await this.findOneBy({ providerId: providerId });
    }

    async findOneByUserId(userId: string) {
        return await this.findOneBy({ userId: userId });
    }

    async findOneByNickname(nickname: string) {
        return await this.findOneBy({ nickname: nickname });
    }

    async findOneWithStats(userId: string) {
        return await this.findOne({
            where: { userId: userId },
            relations: ['github', 'algorithm', 'grade', 'totalScore'],
        });
    }

    async updateUser(userId: string, user: User) {
        return await this.update({ userId: userId }, user);
    }
}
