import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GithubRepository } from './github.repository';
import { Github } from '../Entity/github';
import { CreateGithubDto } from './createGitub.dto';

@Injectable()
export class GithubService {
    private logger = new Logger();
    constructor(
        private configService: ConfigService,
        private githubRepository: GithubRepository,
    ) {}

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
        github.githubId = userResource.id;
        await this.githubRepository.save(github);
    }

    public async modifyGithub(tokens: CreateGithubDto, userId: string) {
        const userResource = await this.getUserResource(tokens.accessToken);
        const githubPoint = this.calculateGithubPoint(userResource);

        const isExist = await this.githubRepository.findOne(userId);

        if (!isExist) {
            throw new BadRequestException(
                '유저의 Github 정보를 찾을 수 없습니다',
            );
        }

        const github = new Github();
        github.userId = userId;
        github.point = githubPoint;
        github.accessToken = tokens.accessToken;
        github.githubId = userResource.id;
        await this.githubRepository.update(github);
    }

    public async updateGithubList() {
        const userGithubList = await this.githubRepository.findAll();

        for (let i = 0; i < userGithubList.length; i++) {
            const userResource = await this.getUserResource(
                userGithubList[i].accessToken,
            );

            userGithubList[i].point = this.calculateGithubPoint(userResource);
            await this.githubRepository.update(userGithubList[i]);
        }
    }

    public async deleteGithub(userId: string) {
        await this.githubRepository.delete(userId);
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
        return returnData.access_token;
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
                this.logger.error('AccessToken 에 문제가 있음');
            } else if (userResourceJson.message === 'Requires authentication') {
                this.logger.error(
                    'Auth Header 에 AccessToken 이 포함되지 않음',
                );
            }
        }
    }

    // public async redirect(code: string) {
    //     const accessToken = await this.fetchAccessToken(code);
    //     const userResource = await this.getUserResource(accessToken);
    //     const isExist = await this.githubRepository.findOne(userResource.id);
    //
    //     if (isExist) {
    //         throw new BadRequestException('이미 등록된 id 입니다');
    //     }
    //
    //     const githubPoint = this.calculateGithubPoint(userResource);
    //
    //     const github = new Github();
    //     github.userId = '123';
    //     github.point = githubPoint;
    //     github.accessToken = accessToken;
    //     github.githubId = userResource.id;
    //     await this.githubRepository.save(github);
    // }
}
