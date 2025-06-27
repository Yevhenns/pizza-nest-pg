import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from '../services/categories.service';
import { Category } from '../entities/category.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Get categories list' })
  @ApiResponse({
    status: 200,
    description: 'Returns categories list',
    type: Category,
    isArray: true,
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns category by ID',
    type: Category,
  })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }
}
