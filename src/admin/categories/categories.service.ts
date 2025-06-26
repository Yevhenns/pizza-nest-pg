import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../catalog/categories/entities/category.entity';

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
      this.logger.error('Error during registration', error);

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
        this.logger.warn(`Role with id ${id} not found`);
        throw new NotFoundException('Category not found');
      }

      const updateDto: UpdateCategoryDto = {
        name: updateCategoryDto.name,
      };

      const updated = this.categoriesRepository.merge(category, updateDto);

      return await this.categoriesRepository.save(updated);
    } catch (error) {
      this.logger.error('Error during delete category', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Delete category failed');
    }
  }

  async remove(id: number) {
    try {
      const category = await this.categoriesRepository.findOneBy({ id });

      if (!category) {
        this.logger.warn(`Role with id ${id} not found`);
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
