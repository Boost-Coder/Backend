import { Body, Controller, Post } from '@nestjs/common';
import { AppleLoginDto } from './appleLogin.dto';

@Controller('api')
export class AuthController {
    @Post('appleOAuth')
    signInWithApple(@Body() body: AppleLoginDto) {}
}
