import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../products/products.module';
import { SupplementsModule } from '../supplements/supplements.module';
import { Category } from '../../catalog/categories/entities/category.entity';
import { CategoriesService } from './services/categories.service';
import { Product } from '~/catalog/products/entities/product.entity';
import { Supplement } from '~/catalog/supplements/entities/supplement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product, Supplement]),
    ProductsModule,
    SupplementsModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
