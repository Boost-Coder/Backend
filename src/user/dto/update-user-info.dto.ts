import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserInfoDto {
    @IsString()
    @IsOptional()
    nickname: string;

    @IsString()
    @IsOptional()
    major: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsNumber()
    @IsOptional()
    studentId: number;

    @IsString()
    @IsOptional()
    birthDate: Date;
}
