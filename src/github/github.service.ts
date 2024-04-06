import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GithubRepository } from './github.repository';
import { Github } from '../Entity/github';
import { CreateGithubDto } from './createGitub.dto';

@Injectable()
export class GithubService {
    constructor(
        private configService: ConfigService,
        private githubRepository: GithubRepository,
    ) {}

    public async redirect(code: string) {
        const [accessToken, refreshToken] = await this.fetchAccessToken(code);
        const userResource = await this.getUserResource(accessToken + '123');
        console.log(userResource);
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

    public async createGithub(tokens: CreateGithubDto, userId: string) {
        const userResource = await this.getUserResource(tokens.accessToken);

        const isExist = await this.githubRepository.findOne(userId);

        if (isExist) {
            throw new BadRequestException('이미 등록된 id 입니다');
        }

        const githubPoint = this.calculateGithubPoint(userResource);

        const github = new Github();
        github.userId = userId;
        github.point = githubPoint;
        github.accessToken = tokens.accessToken;
        github.refreshToken = tokens.refreshToken;
        github.githubId = userResource.id;
        await this.githubRepository.save(github);
    }

    public async modifyGithub(tokens: CreateGithubDto, userId: string) {
        const userResource = await this.getUserResource(tokens.accessToken);
        const githubPoint = this.calculateGithubPoint(userResource);

        const github = new Github();
        github.userId = userId;
        github.point = githubPoint;
        github.accessToken = tokens.accessToken;
        github.refreshToken = tokens.refreshToken;
        github.githubId = userResource.id;
        await this.githubRepository.update(github);
    }

    public async updateGithub(tokens: CreateGithubDto, userId: string) {}
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

        const userResourceJson = await userResource.json();

        if (!userResourceJson.message) return userResourceJson;
        else {
            if (userResourceJson.message === 'Bad credentials') {
                // 고민중
                // 이 경우, accessToken 이 잘못된 경우인데, 이 경우는 서버 오류인가....
            } else if (userResourceJson.message === 'Requires authentication') {
                // token 이 포함되지 않음
            }
        }
    }
}
