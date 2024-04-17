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
import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetUsersResponseDto } from './dto/get-users-response.dto';

@UseGuards(JwtAuthGuard)
@Controller('api/users')
export class UserController {
    constructor(private userService: UserService) {}
    환;
    @ApiTags('users')
    @ApiOperation({
        summary: '유저 개인정보 반환 API',
        description: '유저 개인정보 반환 (GitHub id , Solved id 등등)',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '회원정보 반환 성공',
        type: GetUsersResponseDto,
    })
    @ApiUnauthorizedResponse({
        description: 'jwt 관련 문제 (인증 시간이 만료됨, jwt를 보내지 않음)',
    })
    @ApiForbiddenResponse({
        description: '허용되지 않은 자원에 접근한 경우. 즉, 권한이 없는 경우',
    })
    @ApiNotFoundResponse({
        description:
            'user가 존재하지 않는 경우. 즉, 작업하려는 user가 존재하지 않는 경우',
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
    })
    @Get(':id')
    async userFind(@Param('id') userId: string) {
        return await this.userService.findUserByUserId(userId);
    }

    @ApiTags('users')
    @ApiOperation({
        summary: '유저 정보 수정 API',
        description: '회원정보를 수정한다. nickname 만 수정가능하다.',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '닉네임 수정 성공',
    })
    @ApiUnauthorizedResponse({
        description: 'jwt 관련 문제 (인증 시간이 만료됨, jwt를 보내지 않음)',
    })
    @ApiForbiddenResponse({
        description: '허용되지 않은 자원에 접근한 경우. 즉, 권한이 없는 경우',
    })
    @ApiNotFoundResponse({
        description:
            'user가 존재하지 않는 경우. 즉, 작업하려는 user가 존재하지 않는 경우',
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
    })
    @UseGuards(OwnershipGuard)
    @Put(':id')
    async userModify(
        @Body() body: UpdateUserInfoDto,
        @Param('id') userId: string,
    ) {
        await this.userService.updateUserInfo(userId, body);
    }

    @ApiTags('users')
    @ApiOperation({
        summary: '유저 삭제 API',
        description: '회원정보를 삭제한다. 회원탈퇴 하는 API',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '유저 삭제 성공',
    })
    @ApiUnauthorizedResponse({
        description: 'jwt 관련 문제 (인증 시간이 만료됨, jwt를 보내지 않음)',
    })
    @ApiForbiddenResponse({
        description: '허용되지 않은 자원에 접근한 경우. 즉, 권한이 없는 경우',
    })
    @ApiNotFoundResponse({
        description:
            'user가 존재하지 않는 경우. 즉, 작업하려는 user가 존재하지 않는 경우',
    })
    @ApiInternalServerErrorResponse({
        description: '서버 오류',
    })
    @UseGuards(OwnershipGuard)
    @Delete(':id')
    async userRemove(@Param('id') userId: string) {
        await this.userService.removeUser(userId);
    }
}
