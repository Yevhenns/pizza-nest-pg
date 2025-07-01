import { Module } from '@nestjs/common';
import { SupplementsService } from './services/supplements.service';
import { SupplementsController } from './controllers/supplements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplement } from '~/catalog/supplements/entities/supplement.entity';
import { Category } from '~/catalog/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplement, Category])],
  controllers: [SupplementsController],
  providers: [SupplementsService],
  exports: [SupplementsService],
})
export class SupplementsModule {}
