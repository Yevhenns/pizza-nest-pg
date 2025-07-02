import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from '../services/products.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateProductDto } from '~/admin/products/dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Get products list or filter by category' })
  @ApiResponse({
    status: 200,
    description:
      'Returns products list. Add https://res.cloudinary.com/dyka4vajb/image/upload/ to image',
    type: [CreateProductDto],
  })
  @ApiQuery({ name: 'categoryId', required: false, type: Number })
  findAll(@Query('categoryId') categoryId?: string) {
    return this.productsService.findAll(categoryId ? +categoryId : undefined);
  }

  @Get('promotions')
  @ApiOperation({ summary: 'Get promotions products list' })
  @ApiResponse({
    status: 200,
    description:
      'Returns promotions products list. Add https://res.cloudinary.com/dyka4vajb/image/upload/ to image',
    type: [CreateProductDto],
  })
  findPromotions() {
    return this.productsService.findPromotions();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({
    status: 200,
    description:
      'Returns product by ID. Add https://res.cloudinary.com/dyka4vajb/image/upload/ to image',
    type: CreateProductDto,
  })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }
}
