import {
    Body,
    Controller,
    Post,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import { AppleLoginDto } from './appleLogin.dto';
import { AuthService } from './auth.service';
import { SejongAuthDto } from './sejongAuth.dto';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UserId } from '../decorator/user-id.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @ApiTags('auth')
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
    @Post('sejong')
    @UseGuards(JwtAuthGuard)
    public async sejongAuth(
        @Body() body: SejongAuthDto,
        @UserId() userId: string,
    ) {
        return await this.authService.checkSejongStudent(body, userId);
    }

    @ApiTags('auth')
    @Post('checkNickname')
    @UseGuards(JwtAuthGuard)
    public async checkNickname(@Body('nickname') nickname: string) {
        return await this.authService.checkNicknameDuplicate(nickname);
    }

    @ApiTags('auth')
    @Post('refresh')
    public refreshTokens(@Body('refreshToken') refreshToken: string) {
        return this.authService.sendTokens(refreshToken);
    }
}
