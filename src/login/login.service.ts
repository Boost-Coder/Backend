import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class LoginService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    public sendTokens(refreshToken: string) {
        const payload = this.validateRefreshToken(refreshToken);

        if (payload) {
            return {
                accessToken: this.generateAccessToken(payload.userId),
                refreshToken: this.generateRefreshToken(payload.userId),
            };
        }
    }

    public generateAccessToken(userId: string): string {
        return this.jwtService.sign(
            {
                userId: userId,
            },
            {
                secret: this.configService.get('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.get('JWT_ACCESS_EXPIRES_IN'),
            },
        );
    }

    public generateRefreshToken(userId: string): string {
        return this.jwtService.sign(
            {
                userId: userId,
            },
            {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
            },
        );
    }
    public validateRefreshToken(refreshToken: string) {
        try {
            return this.jwtService.verify(refreshToken, {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
            });
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new UnauthorizedException();
            }
        }
    }
}
