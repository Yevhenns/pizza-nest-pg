import { Module } from '@nestjs/common';
import { SupplementsService } from './services/supplements.service';
import { SupplementsController } from './controllers/supplements.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplement } from './entities/supplement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Supplement])],
  controllers: [SupplementsController],
  providers: [SupplementsService],
  exports: [SupplementsService],
})
export class SupplementsModule {}
