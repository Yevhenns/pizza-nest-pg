import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CategoriesService } from '../services/categories.service';
import { AdminGuard } from '~/auth/guards/admin.guard';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import { Category } from '~/catalog/categories/entities/category.entity';

@Controller('admin/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({
    status: 201,
    description: 'Returns created category',
    type: Category,
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Update category' })
  @ApiResponse({
    status: 200,
    description: 'Returns updated category',
    type: Category,
  })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Delete category by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns object { message: "Category with ID # removed" }',
    type: Object,
  })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
