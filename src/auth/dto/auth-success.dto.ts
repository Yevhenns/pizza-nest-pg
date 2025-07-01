import { ApiProperty } from '@nestjs/swagger';

export class AuthSuccessDto {
  @ApiProperty({
    example: 'Operation completed successfully.',
    description: 'General success message',
  })
  message: string;
}
