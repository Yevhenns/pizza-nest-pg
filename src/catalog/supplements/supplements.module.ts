import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplement } from './entities/supplement.entity';
import { SupplementsController } from './controllers/supplements.controller';
import { SupplementsService } from './services/supplements.service';

@Module({
  imports: [TypeOrmModule.forFeature([Supplement])],
  controllers: [SupplementsController],
  providers: [SupplementsService],
  exports: [SupplementsService],
})
export class SupplementsModule {}
