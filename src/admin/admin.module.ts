import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { SupplementsModule } from './supplements/supplements.module';

@Module({
  imports: [ProductsModule, CategoriesModule, SupplementsModule],
})
export class AdminModule {}
