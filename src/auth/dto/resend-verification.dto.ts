import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class ResendVerificationDto {
  @ApiProperty({
    description: 'User email',
    example: 'alex@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
