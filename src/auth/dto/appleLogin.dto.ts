import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AppleLoginDto {
    @ApiProperty()
    @IsString()
    authorizationCode: string;

    @ApiProperty()
    @IsString()
    identityToken: string;
}

export class AppleLoginResponseDto {
    @ApiProperty()
    accessToken: string;

    @ApiProperty()
    refreshToken: string;

    @ApiProperty({
        description:
            '로그인 하려는 유저가 세종대 인증, 넥네임 등록 까지 모두 한경우만 true',
    })
    isMember: boolean;

    @ApiProperty()
    userId: string;
}
