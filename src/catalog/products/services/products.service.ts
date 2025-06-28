import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private readonly logger = new Logger(ProductsService.name);

  async findAll(categoryId?: number) {
    const where = categoryId ? { category: { id: categoryId } } : undefined;
    try {
      const products = await this.productRepository.find({
        where,
        relations: ['category'],
      });
      return products;
    } catch (error) {
      this.logger.error('Error fetching products', error);
      throw error;
    }
  }

  async findPromotions() {
    try {
      const products = await this.productRepository.find({
        where: { promotion: true },
        relations: ['category'],
      });
      return products;
    } catch (error) {
      this.logger.error('Error fetching promotion products', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const product = await this.productRepository.findOne({
        where: { id },
        relations: ['category'],
      });
      if (!product) {
        this.logger.warn(`Product with id ${id} not found`);
        throw new NotFoundException(`Product with id ${id} not found`);
      }
      return product;
    } catch (error) {
      this.logger.error(`Error fetching product with id ${id}`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Find one product failed');
    }
  }
}
