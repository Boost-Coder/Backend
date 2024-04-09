import {
    Body,
    Controller,
    Delete,
    Param,
    Put,
    UseGuards,
} from '@nestjs/common';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OwnershipGuard } from '../auth/guard/ownership.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UserController {
    constructor(private userService: UserService) {}

    @UseGuards(OwnershipGuard)
    @Put(':id')
    async userModify(
        @Body() body: UpdateUserInfoDto,
        @Param('id') userId: string,
    ) {
        await this.userService.updateUserInfo(userId, body);
    }

    @UseGuards(OwnershipGuard)
    @Delete(':id')
    async userRemove(@Param('id') userId: string) {
        await this.userService.removeUser(userId);
    }
}
