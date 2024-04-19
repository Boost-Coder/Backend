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
    user_id: string;

    @ApiProperty()
    point: number;

    @ApiProperty()
    nickname: string;
}
