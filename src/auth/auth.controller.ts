import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AppleLoginDto } from './appleLogin.dto';
import { AuthService } from './auth.service';

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
}
