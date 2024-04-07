import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
    constructor(private userRepository: UserRepository) {}

    async getUserByProviderId(providerId: string) {
        const user = await this.userRepository.findOneByProviderId(providerId);
        return user;
    }
}
