import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtConfig } from '../Config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { TotalModule } from '../total/total.module';

@Module({
    imports: [
        JwtModule.registerAsync({ useClass: JwtConfig }),
        UserModule,
        TotalModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
