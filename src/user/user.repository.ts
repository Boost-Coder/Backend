import { Inject, Injectable, Scope } from '@nestjs/common';
import { BaseRepository } from '../utils/base.repository';
import { DataSource, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { User } from '../Entity/user';
import { Algorithm } from '../Entity/algorithm';

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

    async save(user: User) {
        await this.repository.save(user);
    }
}
