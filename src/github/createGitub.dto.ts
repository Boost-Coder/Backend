import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGithubDto {
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    refreshToken: string;
}
