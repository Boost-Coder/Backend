import { IsNumber, IsString } from 'class-validator';

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
    birthDate: Date;
}
