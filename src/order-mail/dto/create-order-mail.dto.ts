import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class OrderItemDto {
  @ApiProperty({ example: 'Pepperoni Pizza', description: 'Product title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 2, description: 'Quantity of product' })
  @IsInt()
  @Min(1)
  quantity: number;

  @ApiProperty({
    example: ['Extra cheese', 'Spicy sauce'],
    description: 'Selected options for the product',
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  optionsTitles?: string[];
}

export class CreateOrderMailDto {
  @ApiProperty({ example: 'Alex', description: 'Customer name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '380931234567', description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({
    example: 'Kyiv, Ukraine',
    description: 'Delivery address',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: 'Leave at the door',
    description: 'Customer comment',
    required: false,
  })
  @IsOptional()
  @IsString()
  comment?: string;

  @ApiProperty({
    description: 'Array of ordered products',
    type: [OrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  order: OrderItemDto[];

  @ApiProperty({ example: 560, description: 'Total order sum' })
  @IsInt()
  @Min(1)
  orderSum: number;
}
