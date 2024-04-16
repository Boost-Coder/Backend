import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAlgorithmDto {
    @IsString()
    @IsNotEmpty()
    bojId: string;
}
