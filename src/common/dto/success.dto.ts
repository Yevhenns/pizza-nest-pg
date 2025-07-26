import { ApiProperty } from '@nestjs/swagger';

export class SuccessDto {
  @ApiProperty({
    example: 'Operation completed successfully.',
    description: 'General success message',
  })
  message: string;
}
