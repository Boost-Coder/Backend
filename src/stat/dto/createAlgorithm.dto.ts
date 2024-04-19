import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlgorithmDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    bojId: string;
}
