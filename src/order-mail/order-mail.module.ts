import { Module } from '@nestjs/common';
import { OrderMailController } from './controllers/order-mail.controller';
import { OrderMailService } from './services/order-mail.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrder } from './entities/order-mail.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from '~/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrder, User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [OrderMailController],
  providers: [OrderMailService],
})
export class OrderMailModule {}
