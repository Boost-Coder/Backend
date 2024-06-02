import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CompareUsersDto {
    @ApiProperty({ required: true })
    @IsString()
    user1: string;

    @ApiProperty({ required: true })
    user2: string;
}

export class CompareUsersResponseDto {
    @ApiProperty()
    algorithmScoreDifference: number;

    @ApiProperty()
    algorithmRankDifference: number;

    @ApiProperty()
    githubScoreDifference: number;

    @ApiProperty()
    githubRankDifference: number;

    @ApiProperty()
    gradeScoreDifference: number;

    @ApiProperty()
    gradeRankDifference: number;

    @ApiProperty()
    totalScoreDifference: number;

    @ApiProperty()
    totalRankDifference: number;

    @ApiProperty()
    mostSignificantScoreDifferenceStat: string;
}
