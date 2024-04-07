import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AppleLoginDto } from './appleLogin.dto';
import { AuthService } from './auth.service';

@Controller('api')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('appleOAuth')
    async signInWithApple(@Body() body: AppleLoginDto) {
        const providerId = await this.authService.validateAppleOAuth(body);
        if (!providerId) {
            throw new UnauthorizedException('토큰이 유효하지 않음');
        }
        return this.authService.logInOrSignUp(providerId);
    }
}
