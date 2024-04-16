import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RankListOptionDto {
    @IsString()
    @IsOptional()
    major: string;

    @IsNumber()
    @IsOptional()
    class: number;

    @IsOptional()
    cursorPoint: number;

    @IsOptional()
    cursorUserId: string;
}
