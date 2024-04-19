import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGithubDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    accessToken: string;
}
