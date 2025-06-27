import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { ProductsService } from '../services/products.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from 'src/catalog/products/entities/product.entity';

@Controller('admin/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Create product' })
  @ApiResponse({
    status: 201,
    description: 'Returns created product',
    type: Product,
  })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Update product' })
  @ApiResponse({
    status: 200,
    description: 'Returns updated product',
    type: Product,
  })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns object { message: "Product with ID # removed" }',
    type: Object,
  })
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}
