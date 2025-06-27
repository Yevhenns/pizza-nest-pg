import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Product } from '../entities/product.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get products list' })
  @ApiResponse({
    status: 200,
    description: 'Returns products list',
    type: Product,
    isArray: true,
  })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns product by ID',
    type: Product,
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
}
