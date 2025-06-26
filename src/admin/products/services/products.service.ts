import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/catalog/products/entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private readonly logger = new Logger(ProductsService.name);

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const newProduct = this.productRepository.create(createProductDto);
      const createdProduct = await this.productRepository.save(newProduct);

      return createdProduct;
    } catch (error) {
      this.logger.error('Error during registration', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Create product failed');
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.productRepository.findOneBy({ id });

      if (!product) {
        this.logger.warn(`Role with id ${id} not found`);
        throw new NotFoundException('Category not found');
      }

      const updated = this.productRepository.merge(product, updateProductDto);

      return await this.productRepository.save(updated);
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
      const category = await this.productRepository.findOneBy({ id });

      if (!category) {
        this.logger.warn(`Role with id ${id} not found`);
        throw new NotFoundException('Category not found');
      }

      await this.productRepository.remove(category);

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
