import { Body, Controller } from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('login')
export class LoginController {
    constructor(private loginService: LoginService) {}
    public refreshTokens(@Body('refreshToken') refreshToken: string) {
        return this.loginService.sendTokens(refreshToken);
    }
}
