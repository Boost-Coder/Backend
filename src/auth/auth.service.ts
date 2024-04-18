import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { AppleLoginDto } from './appleLogin.dto';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../Entity/user';
import { ConfigService } from '@nestjs/config';
import { SejongAuthDto } from './sejongAuth.dto';
import { UpdateUserInfoDto } from '../user/dto/update-user-info.dto';
import { TokenExpiredError } from 'jsonwebtoken';
import { TotalService } from '../stat/service/total.service';
import { CheckNicknameResponseDto } from './check-nickname.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private totalService: TotalService,
    ) {}

    async logInOrSignUp(providerId: string) {
        let user = await this.userService.findUserByProviderId(providerId);
        const isMember = this.isMember(user);
        if (!user) {
            user = await this.userService.createUser(providerId);
            await this.totalService.createTotalPoint(user.userId);
        }
        const accessToken = this.generateAccessToken(user.userId);
        const refreshToken = this.generateRefreshToken(user.userId);
        return { accessToken, refreshToken, isMember, userId: user.userId };
    }

    isMember(user: User) {
        return !(
            !user ||
            !user.name ||
            !user.studentId ||
            !user.major ||
            !user.nickname
        );
    }

    generateAccessToken(userId: string): string {
        return this.jwtService.sign({
            userId: userId,
        });
    }

    generateRefreshToken(userId: string): string {
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

    async validateAppleOAuth(appleLoginDto: AppleLoginDto): Promise<string> {
        const payloadClaims = this.decodeIdentityToken(
            appleLoginDto.identityToken,
        ); // 토큰을 디코딩해서 페이로드를 가져옴
        const payloadClaimsJson = JSON.parse(payloadClaims);

        const kid = this.getkid(appleLoginDto.identityToken); // 토큰을 디코딩해서 kid를 가져옴
        const applePublicKey = await this.getApplePublicKey(kid);

        try {
            const isVerified: any = jwt.verify(
                appleLoginDto.identityToken,
                applePublicKey,
            );

            if (isVerified) {
                return payloadClaimsJson.sub;
            } else {
                return null;
            }
        } catch (e) {
            if (e instanceof TokenExpiredError) {
                throw new UnauthorizedException();
            }
            throw e;
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

    public async checkSejongStudent(sejongAuth: SejongAuthDto, userId: string) {
        const fetchURL =
            'https://auth.imsejong.com/auth?method=DosejongSession';

        const isSejong = await fetch(fetchURL, {
            headers: {
                host: 'auth.imsejong.com',
                'Content-type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(sejongAuth),
        });

        const isSejongJson = await isSejong.json();
        if (!isSejongJson.result.is_auth) return { isAuthorized: false };
        else {
            const updateUserDto = new UpdateUserInfoDto();
            updateUserDto.name = isSejongJson.result.body.name;
            updateUserDto.major = isSejongJson.result.body.major;
            updateUserDto.studentId = sejongAuth.id;

            await this.userService.updateUserInfo(userId, updateUserDto);
            return { isAuthorized: isSejongJson.result.is_auth };
        }
    }

    public async checkNicknameDuplicate(
        nickname: string,
    ): Promise<CheckNicknameResponseDto> {
        const isExist = await this.userService.checkNicknameDuplicate(nickname);

        if (isExist) {
            throw new ConflictException('중복되는 닉네임입니다');
        } else {
            return { isDuplicate: false };
        }
    }

    public sendTokens(refreshToken: string) {
        const payload = this.validateRefreshToken(refreshToken);

        return {
            accessToken: this.generateAccessToken(payload.userId),
            refreshToken: this.generateRefreshToken(payload.userId),
        };
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
