import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GithubRepository } from '../repository/github.repository';
import { Github } from '../../Entity/github';
import { CreateGithubDto } from '../dto/createGitub.dto';
import { RankListOptionDto } from '../dto/rank-list-option.dto';
import { PointFindDto } from '../dto/rank-find.dto';

@Injectable()
export class GithubService {
    private logger = new Logger();
    constructor(
        private configService: ConfigService,
        private githubRepository: GithubRepository,
    ) {}

    async findGithub(userId: string) {
        return await this.githubRepository.findOneById(userId);
    }

    public async createGithub(tokens: CreateGithubDto, userId: string) {
        const userResource = await this.getUserResource(tokens.accessToken);

        const isExist = await this.githubRepository.findOneById(userId);

        if (isExist) {
            throw new BadRequestException('이미 등록된 id 입니다');
        }

        const githubPoint = await this.calculateGithubPoint(userResource);

        const github = new Github();
        github.userId = userId;
        github.point = githubPoint;
        github.accessToken = tokens.accessToken;
        github.githubId = userResource.id;
        await this.githubRepository.save(github);
    }

    public async modifyGithub(tokens: CreateGithubDto, userId: string) {
        const userResource = await this.getUserResource(tokens.accessToken);
        const githubPoint = await this.calculateGithubPoint(userResource);

        const isExist = await this.githubRepository.findOneById(userId);

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
        await this.githubRepository.updateGithub(github);
    }

    public async updateGithub(userId: string) {
        const github = await this.githubRepository.findOneById(userId);
        if (github === null) {
            return;
        }
        try {
            const githubInfo = await this.getUserResource(github.accessToken);
            github.point = await this.calculateGithubPoint(githubInfo);
            await this.githubRepository.updateGithub(github);
        } catch (e) {
            this.logger.error(
                `${userId} 님의 알고리즘 스탯이 업데이트 되지 않음. ${e}`,
            );
        }
    }

    public async deleteGithub(userId: string) {
        const isExist = await this.githubRepository.findOneById(userId);

        if (!isExist) {
            throw new BadRequestException(
                '유저의 Github 정보를 찾을 수 없습니다',
            );
        }

        await this.githubRepository.deleteGithub(userId);
    }
    public async calculateGithubPoint(userResource: object) {
        const commitInfo = await this.getCommits(userResource['login']);
        const PRInfo = await this.getPRs(userResource['login']);
        const issueInfo = await this.getIssues(userResource['login']);
        const followers = userResource['followers'];
        const [COMMIT_WEIGHT, PR_WEIGHT, ISSUE_WEIGHT, FOLLOWER_WEIGHT] = [
            2, 3, 2, 1,
        ];
        return (
            commitInfo * COMMIT_WEIGHT +
            issueInfo * ISSUE_WEIGHT +
            PRInfo * PR_WEIGHT +
            followers * FOLLOWER_WEIGHT
        );
    }

    public async getIssues(userName: string) {
        const requestURL = `https://api.github.com/search/issues?q=author:${userName}+is:issue`;

        const commitInfo = await fetch(requestURL, {
            headers: {
                Accept: 'application/json',
            },
        });

        const commitInfoJson = await commitInfo.json();
        return commitInfoJson.total_count;
    }

    public async getPRs(userName: string) {
        const requestURL = `https://api.github.com/search/issues?q=author:${userName}+is:pr`;

        const commitInfo = await fetch(requestURL, {
            headers: {
                Accept: 'application/json',
            },
        });

        const commitInfoJson = await commitInfo.json();
        return commitInfoJson.total_count;
    }

    public async getCommits(userName: string) {
        const requestURL = `https://api.github.com/search/commits?q=author:${userName}`;

        const commitInfo = await fetch(requestURL, {
            headers: {
                Accept: 'application/json',
            },
        });

        const commitInfoJson = await commitInfo.json();
        return commitInfoJson.total_count;
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
                throw new BadRequestException('잘못된 accessToken 입니다');
            } else if (userResourceJson.message === 'Requires authentication') {
                this.logger.error(
                    'Auth Header 에 AccessToken 이 포함되지 않음',
                );
                throw new InternalServerErrorException(
                    'Auth Header 에 AccessToken 이 포함되지 않음',
                );
            }
        }
    }

    public async getIndividualGithubRank(
        userId: string,
        options: PointFindDto,
    ) {
        return await this.githubRepository.findIndividualRank(userId, options);
    }

    // public async redirect(code: string) {
    //     const accessToken = await this.fetchAccessToken(code);
    //     console.log(accessToken);
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
    async getGithubRank(options: RankListOptionDto) {
        if (
            (options.cursorPoint && !options.cursorUserId) ||
            (!options.cursorPoint && options.cursorUserId)
        ) {
            throw new BadRequestException('Cursor Element Must Be Two');
        }
        return await this.githubRepository.findWithRank(options);
    }
}
