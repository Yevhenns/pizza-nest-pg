import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '~/catalog/products/entities/product.entity';
import { Category } from '~/catalog/categories/entities/category.entity';
import { CloudinaryService } from '~/cloudinary/services/cloudinary.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @Inject(CloudinaryService)
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private readonly logger = new Logger(ProductsService.name);
  private readonly folderName = 'products';

  async create(
    createProductDto: CreateProductDto,
    image: Express.Multer.File,
  ): Promise<Product> {
    try {
      if (!image) {
        throw new BadRequestException('File is required');
      }

      const category = await this.categoryRepository.findOneBy({
        id: createProductDto.categoryId,
      });

      if (!category) {
        this.logger.error('Category not found');
        throw new NotFoundException('Category not found');
      }

      const uploaded = await this.cloudinaryService.uploadFile(
        image,
        this.folderName,
      );

      if (!uploaded) {
        throw new InternalServerErrorException('Failed to upload file');
      }

      const newProduct = this.productRepository.create({
        ...createProductDto,
        image: uploaded.public_id as string,
        category,
      });

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

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    image: Express.Multer.File,
  ): Promise<Product> {
    try {
      const category = await this.categoryRepository.findOneBy({
        id: updateProductDto.categoryId,
      });

      if (!category) {
        this.logger.error('Category not found');
        throw new NotFoundException('Category not found');
      }

      const product = await this.productRepository.findOneBy({ id });

      if (!product) {
        this.logger.warn(`Product with id ${id} not found`);
        throw new NotFoundException('Product not found');
      }

      const oldImageId = product.image;

      let uploadedUrl: string | undefined;

      if (image) {
        const uploaded = await this.cloudinaryService.uploadFile(
          image,
          this.folderName,
        );
        uploadedUrl = uploaded.public_id as string;
      }

      const updated = this.productRepository.merge(product, {
        ...updateProductDto,
        image: uploadedUrl || product.image,
        category,
      });

      if (uploadedUrl) {
        await this.cloudinaryService.deleteFile(oldImageId);
      }

      return await this.productRepository.save(updated);
    } catch (error) {
      this.logger.error('Error during update product', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Update product failed');
    }
  }

  async remove(id: number): Promise<{
    message: string;
  }> {
    try {
      const product = await this.productRepository.findOneBy({ id });

      if (!product) {
        this.logger.warn('Product not found');
        throw new NotFoundException('Product not found');
      }

      await this.productRepository.remove(product);

      await this.cloudinaryService.deleteFile(product.image);

      return { message: 'Product removed' };
    } catch (error) {
      this.logger.error('Error during delete product', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Delete product failed');
    }
  }
}
