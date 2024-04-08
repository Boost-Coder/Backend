import { Body, Controller, Param, Put } from '@nestjs/common';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { UserService } from './user.service';

@Controller('api/users')
export class UserController {
    constructor(private userService: UserService) {}

    @Put(':id')
    async userModify(
        @Body() body: UpdateUserInfoDto,
        @Param('id') userId: string,
    ) {
        await this.userService.updateUserInfo(userId, body);
    }
}
