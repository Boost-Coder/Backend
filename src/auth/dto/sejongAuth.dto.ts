import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SejongAuthDto {
    @ApiProperty()
    @IsString()
    id: number;

    @ApiProperty()
    @IsString()
    pw: string;
}

export class SejongAuthResponseDto {
    @ApiProperty()
    isAuthorized: boolean;
}
