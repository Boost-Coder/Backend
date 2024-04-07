import { IsString } from 'class-validator';

export class AppleLoginDto {
    @IsString()
    authorizationCode: string;

    @IsString()
    identityToken: string;
}
