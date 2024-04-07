import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AlgorithmRepository } from '../algorithm/algorithm.repository';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import mock = jest.mock;
import { User } from '../Entity/user';

const mockUserService = {
    getUserByProviderId: jest.fn(),
    createUser: jest.fn(),
};

const mockJwtService = {
    sign: jest.fn(),
};

const mockConfigService = {
    get: jest.fn(),
};

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateToken', function () {
        const user = new User();
        user.userId = 'user';
        it('should generate access token', function () {
            mockJwtService.sign.mockResolvedValue('jwt-token');

            service.generateAccessToken(user);

            expect(mockJwtService.sign).toHaveBeenCalledWith({
                userId: user.userId,
            });
        });
    });

    describe('logInOrSignUp', function () {
        const providerId = 'sample';
        const user = new User();
        user.userId = 'user';
        user.providerId = providerId;
        it('should login', async function () {
            mockUserService.getUserByProviderId.mockResolvedValue(user);

            await service.logInOrSignUp(providerId);

            expect(mockUserService.createUser).not.toHaveBeenCalled();
        });

        it('should signup', async function () {
            mockUserService.getUserByProviderId.mockResolvedValue(null);
            mockUserService.createUser.mockResolvedValue(user);

            await service.logInOrSignUp(providerId);

            expect(mockUserService.createUser).toHaveBeenCalled();
        });
    });
});
