import { Injectable } from '@nestjs/common';
import { AppleLoginDto } from './appleLogin.dto';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../Entity/user';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async logInOrSignUp(providerId: string) {
        let user = await this.userService.findUserByProviderId(providerId);
        if (!user) {
            user = await this.userService.createUser(providerId);
        }
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user);
        return { accessToken, refreshToken };
    }

    generateAccessToken(user: User): string {
        return this.jwtService.sign({
            userId: user.userId,
        });
    }

    generateRefreshToken(user: User): string {
        return this.jwtService.sign(
            {
                userId: user.userId,
            },
            {
                secret: this.configService.get('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN'),
            },
        );
    }

    async validateAppleOAuth(appleLoginDto: AppleLoginDto): Promise<string> {
        const payloadClaims = this.decodeIdentityToken(
            appleLoginDto.identityToken,
        ); // 토큰을 디코딩해서 페이로드를 가져옴
        const payloadClaimsJson = JSON.parse(payloadClaims);

        const kid = this.getkid(appleLoginDto.identityToken); // 토큰을 디코딩해서 kid를 가져옴
        const applePublicKey = await this.getApplePublicKey(kid);

        const isVerified: any = jwt.verify(
            appleLoginDto.identityToken,
            applePublicKey,
        );

        if (isVerified) {
            return payloadClaimsJson.sub;
        } else {
            return null;
        }
    }

    decodeIdentityToken(identityToken: string) {
        const identityTokenParts = identityToken.split('.');
        const identityTokenPayload = identityTokenParts[1];

        return Buffer.from(identityTokenPayload, 'base64').toString();
    }

    getkid(identityToken: string) {
        const identityTokenParts = identityToken.split('.');
        const identityTokenHeader = identityTokenParts[0];

        const headerClaims = Buffer.from(
            identityTokenHeader,
            'base64',
        ).toString();

        const headerClaimsJson = JSON.parse(headerClaims);

        return headerClaimsJson.kid;
    }

    async getApplePublicKey(kid: string) {
        const client = jwksClient({
            jwksUri: 'https://appleid.apple.com/auth/keys',
        });

        const key = await client.getSigningKey(kid);
        return key.getPublicKey();
    }
}
