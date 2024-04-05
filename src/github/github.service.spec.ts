import { Test, TestingModule } from '@nestjs/testing';
import { GithubService } from './github.service';
import { GithubRepository } from './github.repository';
import { ConfigService } from '@nestjs/config';
import fetchMock from 'jest-fetch-mock';

const mockGithubRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
};

fetchMock.enableMocks();

describe('GithubService', () => {
    let service: GithubService;
    let repository: GithubRepository;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GithubService,
                ConfigService,
                {
                    provide: GithubRepository,
                    useValue: mockGithubRepository,
                },
            ],
        }).compile();

        service = module.get<GithubService>(GithubService);
        repository = module.get(GithubRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAccessToken', function () {
        it('Get AccessToken from Github', async function () {
            fetchMock.mockResponseOnce(
                JSON.stringify({
                    access_token: '123456',
                    refresh_token: '1234567',
                }),
            );

            const [accessToken, refreshToken] =
                await service.fetchAccessToken('1234');

            expect(accessToken).toEqual('123456');
            expect(refreshToken).toEqual('1234567');
        });
    });
});
