import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../Entity/user';
import { TotalService } from '../total/total.service';

const mockUserService = {
    findUserByProviderId: jest.fn(),
    createUser: jest.fn(),
};

const mockJwtService = {
    sign: jest.fn(),
};

const mockConfigService = {
    get: jest.fn(),
};

const mockTotalService = {
    createTotalPoint: jest.fn(),
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
                {
                    provide: TotalService,
                    useValue: mockTotalService,
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
        user.nickname = 'qwe';
        user.major = 'qwe';
        user.name = 'qwe';
        user.studentId = 123;
        it('should login', async function () {
            mockUserService.findUserByProviderId.mockResolvedValue(user);

            const result = await service.logInOrSignUp(providerId);

            expect(mockUserService.createUser).not.toHaveBeenCalled();
            expect(mockTotalService.createTotalPoint).not.toHaveBeenCalled();
            expect(result.isMember).toEqual(true);
        });

        it('should signup if user does not exist', async function () {
            mockUserService.findUserByProviderId.mockResolvedValue(null);
            mockUserService.createUser.mockResolvedValue(user);

            const result = await service.logInOrSignUp(providerId);

            expect(mockUserService.createUser).toHaveBeenCalled();
            expect(mockTotalService.createTotalPoint).toHaveBeenCalled();
            expect(result.isMember).toEqual(false);
        });

        it('should signup if user`s data is not perfect', async function () {
            mockUserService.createUser = jest.fn();
            const user = new User();
            user.userId = 'user';
            user.providerId = providerId;
            user.major = 'qwe';
            user.name = 'qwe';
            user.studentId = 123;
            mockUserService.findUserByProviderId.mockResolvedValue(user);

            mockUserService.createUser.mockResolvedValue(user);

            const result = await service.logInOrSignUp(providerId);
            mockUserService.createUser.mockClear();
            mockTotalService.createTotalPoint.mockClear();
            expect(mockUserService.createUser).not.toHaveBeenCalled();
            expect(mockTotalService.createTotalPoint).not.toHaveBeenCalled();
            expect(result.isMember).toEqual(false);
        });
    });
});
