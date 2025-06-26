import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateSupplementDto {
  @ApiProperty({ example: 'Extra Cheese', description: 'Supplement name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 25, description: 'Supplement price' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: true, description: 'Is vegan supplement' })
  @IsBoolean()
  vegan: boolean;

  @ApiProperty({ example: 2, description: 'Category ID for the supplement' })
  @IsNumber()
  @IsPositive()
  categoryId: number;
}
