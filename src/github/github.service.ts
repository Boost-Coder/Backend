import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GithubRepository } from './github.repository';
import { Github } from '../Entity/github';

@Injectable()
export class GithubService {
    constructor(
        private configService: ConfigService,
        private githubRepository: GithubRepository,
    ) {}
    public async createGithub(code: string) {
        const [accessToken, refreshToken] = await this.fetchAccessToken(code);
        const userResource = await this.getUserResource(accessToken);

        const isExist = await this.githubRepository.findOne(userResource.id);

        if (isExist) {
            throw new BadRequestException('이미 등록된 id 입니다');
        }

        const githubPoint = this.calculateGithubPoint(userResource);

        const github = new Github();
        github.userId = '123';
        github.point = githubPoint;
        github.accessToken = accessToken;
        github.refreshToken = refreshToken;
        github.githubId = userResource.id;
        await this.githubRepository.save(github);
    }

    public calculateGithubPoint(userResource: object) {
        return 0;
    }

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
        return [returnData.access_token, returnData.refresh_token];
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
        //await this.repository.save(queryRunner, body);
    }
}
