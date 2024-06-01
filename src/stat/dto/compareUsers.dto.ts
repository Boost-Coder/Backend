import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CompareUsersDto {
    @ApiProperty({ required: true })
    @IsString()
    user1: string;

    @ApiProperty({ required: true })
    user2: number;
}
