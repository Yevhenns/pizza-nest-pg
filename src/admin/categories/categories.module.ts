import { Module } from '@nestjs/common';
import { CategoriesController } from './controllers/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { Supplement } from '../supplements/entities/supplement.entity';
import { ProductsModule } from '../products/products.module';
import { SupplementsModule } from '../supplements/supplements.module';
import { Category } from '../../catalog/categories/entities/category.entity';
import { CategoriesService } from './services/categories.service';

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
