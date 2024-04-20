import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { User } from '../Entity/user';
import { QueryFailedError } from 'typeorm';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';

const mockUserRepository = {
    findOneByProviderId: jest.fn(),
    save: jest.fn(),
    findOneByUserId: jest.fn(),
    updateUser: jest.fn(),
    findOneWithStats: jest.fn(),
    remove: jest.fn(),
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

            const result = await service.findUserByProviderId(providerId);

            expect(result.providerId).toEqual(providerId);
        });

        it('일치하는 user 가 없는 경우', async function () {
            mockUserRepository.findOneByProviderId.mockResolvedValue(null);

            const result = await service.findUserByProviderId(providerId);

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

    describe('changeUserInfo', function () {
        it('should change user`s info', function () {
            const user = new User();
            const userInfoToUpdate = new UpdateUserInfoDto();
            userInfoToUpdate.nickname = 'nickname';
            userInfoToUpdate.major = 'major';
            userInfoToUpdate.name = 'name';
            userInfoToUpdate.studentId = 1234;
            userInfoToUpdate.birthDate = new Date();

            service.changeUserInfo(user, userInfoToUpdate);

            expect(user.nickname).toEqual('nickname');
            expect(user.major).toEqual('major');
            expect(user.name).toEqual('name');
            expect(user.studentId).toEqual(1234);
        });
    });

    describe('updateUserInfo', function () {
        it('수정하려는 user가 없는 경우 예외 발생', async function () {
            const userId = 'user';
            const userInfoToUpdate = new UpdateUserInfoDto();
            mockUserRepository.findOneByUserId.mockResolvedValue(null);

            await expect(
                service.updateUserInfo(userId, userInfoToUpdate),
            ).rejects.toThrow('User not found');
        });

        it('should update user info', async function () {
            const userId = 'user';
            const userInfoToUpdate = new UpdateUserInfoDto();
            userInfoToUpdate.nickname = 'nickname';
            userInfoToUpdate.major = 'major';
            userInfoToUpdate.name = 'name';
            userInfoToUpdate.studentId = 1234;
            userInfoToUpdate.birthDate = new Date();
            const user = new User();
            mockUserRepository.findOneByUserId.mockResolvedValue(user);

            await service.updateUserInfo(userId, userInfoToUpdate);
            const callProperty = mockUserRepository.updateUser.mock.calls[0][1];
            expect(mockUserRepository.updateUser).toHaveBeenCalled();
            expect(callProperty.nickname).toEqual('nickname');
            expect(callProperty.major).toEqual('major');
            expect(callProperty.name).toEqual('name');
        });
    });

    describe('removeUser', function () {
        it('should delete user', async function () {
            const userId = 'user';
            const user = new User();
            mockUserRepository.findOneWithStats.mockResolvedValue(user);

            await service.removeUser(userId);

            expect(mockUserRepository.remove).toHaveBeenCalledWith(user);
        });

        it('should throw Not Found Error', function () {
            const userId = 'user';
            mockUserRepository.findOneWithStats.mockResolvedValue(null);
            expect(service.removeUser(userId)).rejects.toThrow(
                'User Not Found',
            );
        });
    });

    describe('findUserByUserId', function () {
        it('should find user and return user info', async function () {
            const userId = 'qwerty';
            const user = new User();
            user.userId = userId;
            user.studentId = 1234;
            user.major = 'qwe';
            user.name = 'user';
            user.nickname = 'nickname';
            mockUserRepository.findOneByUserId.mockResolvedValue(user);

            const result = await service.findUserByUserId(userId);

            expect(result.userId).toEqual(userId);
            expect(result.studentId).toEqual(1234);
        });

        it('should throw NotFound Exception when uses doesn`t exist', function () {
            mockUserRepository.findOneByUserId.mockResolvedValue(null);
            const userId = 'qwerty';

            expect(service.findUserByUserId(userId)).rejects.toThrow(
                'User Not Found',
            );
        });
    });
});
