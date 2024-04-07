import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { User } from '../Entity/user';

const mockUserRepository = {
    findOneByProviderId: jest.fn(),
    save: jest.fn(),
};

describe('UserService', () => {
    let service: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: UserRepository,
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('generateUserId', function () {
        it('should return userId of length 8.', function () {
            const userId = service.generateUserId();

            expect(userId.length).toEqual(8);
        });
    });

    describe('getUserByProviderId', function () {
        const providerId = 'sample';
        it('should return user', async function () {
            const user = new User();
            user.providerId = providerId;
            mockUserRepository.findOneByProviderId.mockResolvedValue(user);

            const result = await service.getUserByProviderId(providerId);

            expect(result.providerId).toEqual(providerId);
        });

        it('일치하는 user 가 없는 경우', async function () {
            mockUserRepository.findOneByProviderId.mockResolvedValue(null);

            const result = await service.getUserByProviderId(providerId);

            expect(result).toBeNull();
        });
    });
});
