import { ApiProperty } from '@nestjs/swagger';

export class CheckNicknameResponseDto {
    @ApiProperty()
    isDuplicate: boolean;
}
