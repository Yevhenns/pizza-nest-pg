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
      this.logger.error('Create product error', error);

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
        this.logger.warn(`Product with id ${id} not found`);
        throw new NotFoundException('Product not found');
      }

      const updated = this.productRepository.merge(product, updateProductDto);

      return await this.productRepository.save(updated);
    } catch (error) {
      this.logger.error('Error during update product', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Update product failed');
    }
  }

  async remove(id: number) {
    try {
      const product = await this.productRepository.findOneBy({ id });

      if (!product) {
        this.logger.warn(`Product with id ${id} not found`);
        throw new NotFoundException('Product not found');
      }

      await this.productRepository.remove(product);

      return { message: `Product with ID #${id} removed` };
    } catch (error) {
      this.logger.error('Error during delete product', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Delete product failed');
    }
  }
}
