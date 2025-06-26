import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  private readonly logger = new Logger(CategoriesService.name);

  async findAll() {
    try {
      const categories = await this.categoriesRepository.find({
        relations: ['products', 'supplements'],
      });
      return categories;
    } catch (error) {
      this.logger.error('Error fetching categories', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const category = await this.categoriesRepository.findOne({
        where: { id },
        relations: ['products', 'supplements'],
      });
      if (!category) {
        this.logger.warn(`Category with id ${id} not found`);
        throw new NotFoundException(`Category with id ${id} not found`);
      }
      return category;
    } catch (error) {
      this.logger.error(`Error fetching role with id ${id}`, error);
      throw error;
    }
  }
}
