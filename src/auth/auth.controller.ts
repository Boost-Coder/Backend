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

@Controller('api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}
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
    @Post('sejong')
    @UseGuards(JwtAuthGuard)
    public async sejongAuth(
        @Body() body: SejongAuthDto,
        @UserId() userId: string,
    ) {
        return await this.authService.checkSejongStudent(body, userId);
    }

    @Post('checkNickname')
    @UseGuards(JwtAuthGuard)
    public async checkNickname(@Body('nickname') nickname: string) {
        return await this.authService.checkNicknameDuplicate(nickname);
    }
}
