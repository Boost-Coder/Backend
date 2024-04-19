import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class PointFindDto {
    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    major: string;
}
export class RankFindDto {
    @ApiProperty()
    total: number;

    @ApiProperty()
    algorithm: number;

    @ApiProperty()
    github: number;

    @ApiProperty()
    grade: number;

    constructor(total, algorithm, github, grade) {
        this.total = total;
        this.algorithm = algorithm;
        this.github = github;
        this.grade = grade;
    }
}
