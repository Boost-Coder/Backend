import { ApiProperty } from '@nestjs/swagger';

export class StatFindDto {
    @ApiProperty()
    githubPoint: number;

    @ApiProperty()
    algorithmPoint: number;

    @ApiProperty()
    grade: number;

    @ApiProperty()
    totalPoint: number;
}
