import { ApiProperty } from '@nestjs/swagger';

export class GetUsersResponseDto {
    @ApiProperty()
    userId: string;

    @ApiProperty()
    nickname: string;

    @ApiProperty()
    major: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    studentId: number;
}
