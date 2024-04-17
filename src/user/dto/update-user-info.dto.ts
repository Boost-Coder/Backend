import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserInfoDto {
    @ApiProperty()
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
