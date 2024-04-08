import { IsDate, IsNumber, IsString } from 'class-validator';

export class UpdateUserInfoDto {
    @IsString()
    nickname: string;

    @IsString()
    major: string;

    @IsString()
    name: string;

    @IsNumber()
    studentId: number;

    @IsString()
    @IsDate()
    birthDate: string;
}
