import { IsString } from 'class-validator';

export class SejongAuthDto {
    @IsString()
    id: number;

    @IsString()
    pw: string;
}
