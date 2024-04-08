// import { Test, TestingModule } from '@nestjs/testing';
// import { GithubService } from './github.service';
// import { GithubRepository } from './github.repository';
// import { ConfigFactory, ConfigModule, ConfigService } from '@nestjs/config';
// import fetchMock from 'jest-fetch-mock';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { TypeOrmConfigService } from '../Config/typeorm.config';
// import * as process from 'process';
// import { GithubModule } from './github.module';
// import { INestApplication } from '@nestjs/common';
//
// fetchMock.enableMocks();
//
// let app: INestApplication;
// describe('GithubService', () => {
//     // let service: GithubService;
//     // let repository: GithubRepository;
//
//     beforeAll(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             imports: [
//                 TypeOrmModule.forRootAsync({
//                     useClass: TypeOrmConfigService,
//                 }),
//                 ConfigModule.forRoot({
//                     isGlobal: true,
//                     envFilePath: `${process.cwd()}/envs/local.env`,
//                 }),
//                 GithubModule,
//             ],
//         }).compile();
//
//         // service = module.get(GithubService);
//         // repository = module.get(GithubRepository);
//
//         app = module.createNestApplication();
//         await app.init();
//     });
//
//     describe('a+b', function () {
//         it('a + b', function () {
//             expect(1).toEqual(1);
//         });
//     });
//
//     // describe('getAccessToken', function () {
//     //     it('Get AccessToken from Github', async function () {
//     //         fetchMock.mockResponseOnce(
//     //             JSON.stringify({
//     //                 access_token: '123456',
//     //                 refresh_token: '1234567',
//     //             }),
//     //         );
//     //
//     //         const [accessToken, refreshToken] =
//     //             await service.fetchAccessToken('123');
//     //         expect(accessToken).toEqual('123456');
//     //         expect(refreshToken).toEqual('1234567');
//     //     });
//     // });
//     //
//     // describe('createGithub', function () {
//     //     it('Create_Github', async function () {
//     //         fetchMock.mockResponseOnce(
//     //             JSON.stringify({
//     //                 id: 34583294,
//     //             }),
//     //         );
//     //
//     //         await service.createGithub(
//     //             { accessToken: '123456', refreshToken: '1234567' },
//     //             '123',
//     //         );
//     //
//     //         const res = await repository.findOne('123');
//     //
//     //         expect(res.userId).toEqual('123');
//     //         expect(res.accessToken).toEqual('123456');
//     //         expect(res.refreshToken).toEqual('1234567');
//     //     });
//     // });
// });
