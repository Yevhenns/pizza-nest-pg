import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Pepperoni Pizza', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 210, description: 'Product price' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 180, description: 'Promotional price' })
  @IsNumber()
  @IsPositive()
  promPrice: number;

  @ApiProperty({ example: true, description: 'Is under promotion' })
  @IsBoolean()
  promotion: boolean;

  @ApiProperty({ example: false, description: 'Is vegan product' })
  @IsBoolean()
  vegan: boolean;

  @ApiProperty({ example: true, description: 'Is spicy product' })
  @IsBoolean()
  spicy: boolean;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  image: string;

  @ApiProperty({ example: 1, description: 'Category ID (foreign key)' })
  @IsNumber()
  @IsPositive()
  categoryId: number;
}
