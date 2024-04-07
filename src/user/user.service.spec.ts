import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User } from '../Entity/user';
import { QueryFailedError } from 'typeorm';

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

    describe('createUser', function () {
        const providerId = 'sample';
        it('should create User', async function () {
            await service.createUser(providerId);

            expect(mockUserRepository.save).toHaveBeenCalled();
        });

        it('providerId 가 이미 존재하는 경우', async function () {
            mockUserRepository.findOneByProviderId.mockResolvedValue(
                new User(),
            );
            await expect(service.createUser(providerId)).rejects.toThrow(
                'providerId 가 이미 존재함',
            );
        });

        it('generateUserId 로 생성된 Id 가 이미 존재하는 경우', async function () {
            const providerId = 'testProviderId';
            const generatedUserId = '12345678';
            const newUser = new User();
            newUser.providerId = providerId;
            newUser.userId = generatedUserId;

            mockUserRepository.findOneByProviderId.mockResolvedValueOnce(null);
            mockUserRepository.save = jest.fn();
            mockUserRepository.save.mockRejectedValueOnce(
                new QueryFailedError(
                    'fake query',
                    [],
                    new Error('Duplicate entry error'),
                ),
            );

            await service.createUser(providerId);

            expect(mockUserRepository.findOneByProviderId).toHaveBeenCalledWith(
                providerId,
            );
            expect(mockUserRepository.save).toHaveBeenCalledTimes(2);
        });
    });
});
