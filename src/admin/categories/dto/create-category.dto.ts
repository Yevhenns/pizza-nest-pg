import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Pizza',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;
}
