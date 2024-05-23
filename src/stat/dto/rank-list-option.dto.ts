import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RankListOptionDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    major: string;

    @ApiProperty({ required: false })
    @IsOptional()
    cursorPoint: number;

    @ApiProperty({ required: false })
    @IsOptional()
    cursorUserId: string;
}

export class RankListDto {
    @ApiProperty()
    rank: number;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    score: number;

    @ApiProperty()
    nickname: string;
}
