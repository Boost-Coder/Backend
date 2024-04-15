import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtConfig } from '../Config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategy/jwt.strategy';
import { StatModule } from '../stat/stat.module';

@Module({
    imports: [
        JwtModule.registerAsync({ useClass: JwtConfig }),
        UserModule,
        StatModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
