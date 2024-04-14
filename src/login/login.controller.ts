import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('/api')
export class LoginController {
    constructor(private loginService: LoginService) {}

    @Post('login/refresh')
    public refreshTokens(@Body('refreshToken') refreshToken: string) {
        return this.loginService.sendTokens(refreshToken);
    }
}
