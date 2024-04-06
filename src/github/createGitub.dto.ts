import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGithubDto {
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
