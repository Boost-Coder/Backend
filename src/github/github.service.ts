import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GithubRepository } from './github.repository';

@Injectable()
export class GithubService {
    private repository;
    constructor(
        private readonly configService: ConfigService,
        private readonly githubRepository: GithubRepository,
    ) {
        this.repository = githubRepository;
    }
    public async createGithub(code: string) {
        const accessToken = await this.fetchAccessToken(code);
        const userResource = await this.getUserResource(accessToken);
        const calculated = this.calculateGithubPoint(userResource);
    }

    public calculateGithubPoint(userResource: object) {}

    public async fetchAccessToken(authorization_code: string) {
        const ret = await fetch(
            `https://github.com/login/oauth/access_token?client_id=${this.configService.get('GITHUB_CLIENT_ID')}&client_secret=${this.configService.get('GITHUB_CLIENT_SECRET')}&code=${authorization_code}`,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            },
        );

        const returnData = await ret.json();
        return returnData.access_token;
    }

    public async getUserResource(accessToken: string) {
        const resourceURL = 'https://api.github.com/user';
        const userResource = await fetch(resourceURL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        return await userResource.json();
    }

    public async saveMember(queryRunner, body) {
        console.log('service');
        await this.repository.save(queryRunner, body);
    }
}
