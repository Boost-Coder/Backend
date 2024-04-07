import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';

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
});
