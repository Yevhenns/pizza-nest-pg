import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { SupplementsModule } from '../supplements/supplements.module';
import { ProductsModule } from '../products/products.module';
import { Product } from '../products/entities/product.entity';
import { Supplement } from '../supplements/entities/supplement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Product, Supplement]),
    ProductsModule,
    SupplementsModule,
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
