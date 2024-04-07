import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from '../Entity/user';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getUserByProviderId(providerId: string) {
        const user = await this.userRepository.findOneByProviderId(providerId);
        return user;
    }

    async createUser(providerId: string) {
        const user = new User();
        user.providerId = providerId;
        user.userId = this.generateUserId();
        await this.userRepository.save(user);
    }

    generateUserId() {
        const uuid: string = uuidv4();
        return uuid.slice(0, 8);
    }
}
