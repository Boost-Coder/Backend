import { BaseRepository } from '../utils/base.repository';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { Github } from '../Entity/github';
import { DataSource, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class GithubRepository extends BaseRepository {
    private repository: Repository<Github>;

    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
        this.repository = this.getRepository(Github);
    }

    public async save(github: Github) {
        this.repository.save(github);
    }

    public async findOne(id: number) {
        return await this.repository.findOneBy({ githubId: id });
    }
}
