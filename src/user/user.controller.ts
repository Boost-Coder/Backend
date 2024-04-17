import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Put,
    UseGuards,
} from '@nestjs/common';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { OwnershipGuard } from '../auth/guard/ownership.guard';
import { ApiTags } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UserController {
    constructor(private userService: UserService) {}

    @ApiTags('users')
    @Get(':id')
    async userFind(@Param('id') userId: string) {
        return await this.userService.findUserByUserId(userId);
    }

    @ApiTags('users')
    @UseGuards(OwnershipGuard)
    @Put(':id')
    async userModify(
        @Body() body: UpdateUserInfoDto,
        @Param('id') userId: string,
    ) {
        await this.userService.updateUserInfo(userId, body);
    }

    @ApiTags('users')
    @UseGuards(OwnershipGuard)
    @Delete(':id')
    async userRemove(@Param('id') userId: string) {
        await this.userService.removeUser(userId);
    }
}
