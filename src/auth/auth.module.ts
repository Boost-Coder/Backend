import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtConfig } from '../Config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
    imports: [JwtModule.registerAsync({ useClass: JwtConfig }), UserModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
