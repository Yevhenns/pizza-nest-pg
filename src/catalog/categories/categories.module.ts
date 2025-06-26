import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { SupplementsModule } from '../supplements/supplements.module';
import { ProductsModule } from '../products/products.module';
import { Product } from '../products/entities/product.entity';
import { Supplement } from '../supplements/entities/supplement.entity';
import { CategoriesController } from './controllers/categories.controller';
import { CategoriesService } from './services/categories.service';

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
