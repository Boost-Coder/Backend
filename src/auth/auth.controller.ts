import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AppleLoginDto } from './appleLogin.dto';
import { AuthService } from './auth.service';
import { SejongAuthDto } from './sejongAuth.dto';

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
    public async sejongAuth(@Body() body: SejongAuthDto) {
        return await this.authService.checkSejongStudent(body);
    }
}
