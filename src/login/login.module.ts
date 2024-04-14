import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from '../Config/jwt.config';
import { JwtStrategy } from '../auth/strategy/jwt.strategy';

@Module({
    imports: [JwtModule.registerAsync({ useClass: JwtConfig })],
    controllers: [LoginController],
    providers: [LoginService, JwtStrategy],
})
export class LoginModule {}
