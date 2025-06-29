import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleAuthDto {
  @ApiProperty({
    description: 'Google token',
    example: 'dflkjsdklfjoi...',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
