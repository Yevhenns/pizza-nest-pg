import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { Product } from '../entities/product.entity';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get products list or filter by category' })
  @ApiResponse({
    status: 200,
    description: 'Returns products list',
    type: [Product],
  })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  findAll(@Query('categoryId') categoryId?: string) {
    return this.productsService.findAll(categoryId ? +categoryId : undefined);
  }

  @Get('promotions')
  @ApiOperation({ summary: 'Get promotions products list' })
  @ApiResponse({
    status: 200,
    description: 'Returns promotions products list',
    type: Product,
    isArray: true,
  })
  findPromotions() {
    return this.productsService.findPromotions();
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
