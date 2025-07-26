import { Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrder } from './entities/order.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from '~/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrder, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
