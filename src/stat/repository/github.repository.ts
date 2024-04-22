import { Injectable } from '@nestjs/common';
import { Github } from '../../Entity/github';
import { DataSource } from 'typeorm';
import { StatRepository } from '../../utils/stat.repository';

@Injectable()
export class GithubRepository extends StatRepository {
    constructor(dataSource: DataSource) {
        super(dataSource, Github);
    }

    public async findOneById(id: string) {
        return await this.findOneBy({ userId: id });
    }

    public async updateGithub(github: Github) {
        return await this.update(
            { userId: github.userId },
            {
                githubId: github.githubId,
                accessToken: github.accessToken,
                point: github.point,
            },
        );
    }

    public async deleteGithub(id: string) {
        await this.delete({ userId: id });
    }

    public async findAll() {
        return await this.find();
    }
}
