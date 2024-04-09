import { Inject, Injectable, Scope } from '@nestjs/common';
import { BaseRepository } from '../utils/base.repository';
import { DataSource, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { User } from '../Entity/user';

@Injectable({ scope: Scope.REQUEST })
export class UserRepository extends BaseRepository {
    private repository: Repository<User>;
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
        this.repository = this.getRepository(User);
    }

    async findOneByProviderId(providerId: string) {
        return await this.repository.findOneBy({ providerId: providerId });
    }

    async findOneByUserId(userId: string) {
        return await this.repository.findOneBy({ userId: userId });
    }

    async save(user: User) {
        return await this.repository.save(user);
    }

    async update(userId: string, user: User) {
        return await this.repository.update({ userId: userId }, user);
    }

    async delete(user: User) {
        await this.repository.remove(user);
    }
}
