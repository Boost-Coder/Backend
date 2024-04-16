import { IsNumber, IsString } from 'class-validator';

export class RankListOptionDto {
    @IsString()
    major: string;

    @IsNumber()
    class: number;

    cursor: string;
}
