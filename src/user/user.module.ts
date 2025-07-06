import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrder } from '~/order-mail/entities/order-mail.entity';
import { User } from './entities/user.entity';
import { CloudinaryService } from '~/cloudinary/services/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrder, User])],
  controllers: [UserController],
  providers: [UserService, CloudinaryService],
})
export class UserModule {}
