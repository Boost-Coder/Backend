import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../Entity/user';
import { v4 as uuidv4 } from 'uuid';
import { QueryFailedError } from 'typeorm';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getUserByProviderId(providerId: string) {
        const user = await this.userRepository.findOneByProviderId(providerId);
        return user;
    }

    async createUser(providerId: string) {
        const isExist =
            await this.userRepository.findOneByProviderId(providerId);
        if (isExist) {
            throw new ConflictException('providerId 가 이미 존재함');
        }
        const user = new User();
        user.providerId = providerId;
        user.userId = this.generateUserId();
        try {
            return await this.userRepository.save(user);
        } catch (e) {
            if (
                e instanceof QueryFailedError &&
                e.message.includes('Duplicate entry')
            ) {
                user.userId = this.generateUserId();
                return await this.userRepository.save(user);
            } else {
                throw e;
            }
        }
    }

    async updateUserInfo(userId: string, userInfoToUpdate: UpdateUserInfoDto) {
        const user = await this.userRepository.findOneByUserId(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        this.changeUserInfo(user, userInfoToUpdate);

        await this.userRepository.update(userId, user);
    }

    changeUserInfo(user: User, userInfoToUpdate: UpdateUserInfoDto) {
        user.nickname = userInfoToUpdate.nickname;
        user.major = userInfoToUpdate.major;
        user.name = userInfoToUpdate.name;
        user.studentId = userInfoToUpdate.studentId;
        user.birthDate = userInfoToUpdate.birthDate;
    }

    async removeUser(userId: string) {
        const user = await this.userRepository.getRepository(User).findOne({
            where: { userId: userId },
            relations: ['github', 'algorithm', 'grade', 'totalScore'],
        });
        if (!user) {
            throw new NotFoundException('User Not Found');
        }
        await this.userRepository.delete(user);
    }

    generateUserId() {
        const uuid: string = uuidv4();
        return uuid.slice(0, 8);
    }
}
