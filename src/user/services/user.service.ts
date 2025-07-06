import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CustomJwtPayload } from '~/auth/interfaces/auth.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrder } from '~/order-mail/entities/order-mail.entity';
import { User } from '../entities/user.entity';
import { ChangePasswordDto } from '../dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { CloudinaryService } from '~/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserOrder)
    private readonly userOrdersRepository: Repository<UserOrder>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private readonly logger = new Logger(UserService.name);
  private readonly folderName = 'users';

  async findAllOrders(user: CustomJwtPayload): Promise<UserOrder[]> {
    try {
      const userOrders = await this.userOrdersRepository.find({
        where: { user: { id: user.userId } },
      });

      return userOrders;
    } catch (error) {
      this.logger.error('Get orders failed', error);
      throw new InternalServerErrorException('Get orders failed');
    }
  }

  async findOneOrder(user: CustomJwtPayload, id: number): Promise<UserOrder> {
    try {
      const userOrder = await this.userOrdersRepository.findOne({
        where: { id: id, user: { id: user.userId } },
      });

      if (!userOrder) {
        this.logger.error('Order not found');
        throw new NotFoundException('Order not found');
      }

      return userOrder;
    } catch (error) {
      this.logger.error('Get order failed', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Get order failed');
    }
  }

  async update(
    user: CustomJwtPayload,
    updateUserDto: UpdateUserDto,
    avatar: Express.Multer.File,
  ) {
    try {
      const existingUser = await this.userRepository.findOneBy({
        id: user.userId,
      });
      if (!existingUser) {
        this.logger.warn(`User not found`);
        throw new NotFoundException('User not found');
      }

      let uploadedUrl: string | undefined;

      if (avatar) {
        const uploaded = await this.cloudinaryService.uploadFile(
          avatar,
          this.folderName,
        );
        uploadedUrl = uploaded.secure_url as string;
      }

      const updated = this.userRepository.merge(existingUser, {
        ...updateUserDto,
        avatar: uploadedUrl || existingUser.avatar,
      });

      return await this.userRepository.save(updated);
    } catch (error) {
      this.logger.error('Error during update user', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Update user failed');
    }
  }

  async changePassword(
    user: CustomJwtPayload,
    changePasswordDto: ChangePasswordDto,
  ) {
    try {
      const existingUser = await this.userRepository.findOneBy({
        id: user.userId,
      });
      if (!existingUser) {
        this.logger.warn(`User not found`);
        throw new NotFoundException('User not found');
      }

      const isPasswordValid = bcrypt.compareSync(
        changePasswordDto.password,
        existingUser.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect password');
      }

      const hashPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);

      const updated = this.userRepository.merge(existingUser, {
        password: hashPassword,
      });

      await this.userRepository.save(updated);

      return { success: true };
    } catch (error) {
      this.logger.error('Error during update user', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Update user failed');
    }
  }

  async remove(user: CustomJwtPayload): Promise<{
    message: string;
  }> {
    try {
      const existingUser = await this.userRepository.findOneBy({
        id: user.userId,
      });
      if (!existingUser) {
        this.logger.warn(`User not found`);
        throw new NotFoundException('User not found');
      }

      await this.userRepository.remove(existingUser);

      return { message: `User with ID #${user.userId} removed` };
    } catch (error) {
      this.logger.error('Error during delete user', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Delete user failed');
    }
  }
}
