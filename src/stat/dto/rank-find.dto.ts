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

    @ApiProperty()
    totalScore: number;

    @ApiProperty()
    algorithmScore: number;

    @ApiProperty()
    githubScore: number;

    @ApiProperty()
    gradeScore: number;

    @ApiProperty()
    nickname: string;

    constructor(
        total,
        algorithm,
        github,
        grade,
        totalScore,
        algorithmScore,
        githubScore,
        gradeScore,
        nickname,
    ) {
        this.total = total;
        this.algorithm = algorithm;
        this.github = github;
        this.grade = grade;
        this.totalScore = totalScore;
        this.algorithmScore = algorithmScore;
        this.githubScore = githubScore;
        this.gradeScore = gradeScore;
        this.nickname = nickname;
    }
}
