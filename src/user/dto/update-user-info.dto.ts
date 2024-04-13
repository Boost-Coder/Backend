import { IsString } from 'class-validator';

export class UpdateUserInfoDto {
    @IsString()
    nickname: string;
}
