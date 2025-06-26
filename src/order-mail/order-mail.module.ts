import { Module } from '@nestjs/common';
import { OrderMailController } from './controllers/order-mail.controller';
import { OrderMailService } from './services/order-mail.service';

@Module({
  controllers: [OrderMailController],
  providers: [OrderMailService],
})
export class OrderMailModule {}
