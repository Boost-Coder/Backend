import {
    Body,
    Controller,
    Post,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AppleLoginDto, AppleLoginResponseDto } from './dto/appleLogin.dto';
import { AuthService } from './auth.service';
import { SejongAuthDto, SejongAuthResponseDto } from './dto/sejongAuth.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UserId } from '../decorator/user-id.decorator';
import {
    ApiBearerAuth,
    ApiBody,
    ApiForbiddenResponse,
    ApiInternalServerErrorResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CheckNicknameResponseDto } from './dto/check-nickname.dto';
import { RefreshTokenResponseDto } from './dto/refresh-token.dto';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiTags('auth')
    @ApiOperation({
        summary: '애플 로그인 API',
        description:
            '애플 로그인을 처리한다. 처음 로그인하는 요청이라면 해당 애플 정보에 맞추어 임의로 사용자를 생성한다. 이때 닉네임등의 유저 세부 정보는 없다.',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '로그인 성공 혹은 회원가입 성공',
        type: AppleLoginResponseDto,
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
    @Post('apple')
    async signInWithApple(@Body() body: AppleLoginDto) {
        try {
            const providerId = await this.authService.validateAppleOAuth(body);
            if (!providerId) {
                throw new UnauthorizedException('토큰이 유효하지 않음');
            }
            return await this.authService.logInOrSignUp(providerId);
        } catch (e) {
            throw new UnauthorizedException('토큰이 유효하지 않음');
        }
    }

    @ApiTags('auth')
    @ApiOperation({
        summary: '세종대 학생 인증 API',
        description:
            '세종대 학생인지 인증한다. 학번과 비밀번호를 받아 세종대 서버에서 인증한다. 인증에 성공하면 세종대 서버에서 학번, 학과 이름 등을 등록한다.',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '로그인 성공 혹은 회원가입 성공',
        type: SejongAuthResponseDto,
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
    @Post('sejong')
    @UseGuards(JwtAuthGuard)
    public async sejongAuth(
        @Body() body: SejongAuthDto,
        @UserId() userId: string,
    ) {
        return await this.authService.checkSejongStudent(body, userId);
    }

    @ApiTags('auth')
    @ApiOperation({
        summary: '닉네임 중복 확인 API',
        description: '등록하려는 닉네임이 중복이 되는지 확인한다.',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: '닉네임 중복 여부를 반환',
        type: CheckNicknameResponseDto,
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
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nickname: {
                    type: 'string',
                },
            },
        },
    })
    @Post('checkNickname')
    @UseGuards(JwtAuthGuard)
    public async checkNickname(@Body('nickname') nickname: string) {
        return await this.authService.checkNicknameDuplicate(nickname);
    }

    @ApiTags('auth')
    @ApiOperation({
        summary: '토큰 재발급 API',
        description:
            'refresh token을 사용하여 access token과 refresh token을 재발급한다.',
    })
    @ApiBearerAuth('accessToken')
    @ApiOkResponse({
        description: 'access token과 refresh token을 반환',
        type: RefreshTokenResponseDto,
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
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                refreshToken: {
                    type: 'number',
                },
            },
        },
    })
    @Post('refresh')
    public refreshTokens(@Body('refreshToken') refreshToken: string) {
        return this.authService.sendTokens(refreshToken);
    }
}
