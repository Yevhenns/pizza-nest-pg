import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import { Category } from '../../../catalog/categories/entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  private readonly logger = new Logger(CategoriesService.name);

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const newCategory = this.categoriesRepository.create(createCategoryDto);
      const createdCategory = await this.categoriesRepository.save(newCategory);

      return createdCategory;
    } catch (error) {
      this.logger.error('Create category error', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Create category failed');
    }
  }

  async update(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const category = await this.categoriesRepository.findOneBy({ id });

      if (!category) {
        this.logger.warn(`Category with id ${id} not found`);
        throw new NotFoundException('Category not found');
      }

      const updated = this.categoriesRepository.merge(
        category,
        updateCategoryDto,
      );

      return await this.categoriesRepository.save(updated);
    } catch (error) {
      this.logger.error('Error during update category', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Update category failed');
    }
  }

  async remove(id: number) {
    try {
      const category = await this.categoriesRepository.findOneBy({ id });

      if (!category) {
        this.logger.warn(`Category with id ${id} not found`);
        throw new NotFoundException('Category not found');
      }

      await this.categoriesRepository.remove(category);

      return { message: `Category with ID #${id} removed` };
    } catch (error) {
      this.logger.error('Error during delete category', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Delete category failed');
    }
  }
}
