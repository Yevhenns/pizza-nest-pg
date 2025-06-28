import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';
import { UpdateUserRoleDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  async findAll(): Promise<User[]> {
    try {
      const users = await this.userRepository.find({ relations: ['role'] });
      return users;
    } catch (error) {
      this.logger.error('Error fetching users', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const user = await this.userRepository.findOne({
        where: { id },
        relations: ['role'],
      });
      if (!user) {
        this.logger.warn(`User with id ${id} not found`);
        throw new NotFoundException(`User with id ${id} not found`);
      }
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user with id ${id}`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Find one product failed');
    }
  }

  async updateRole(id: number, updateUserRoleDto: UpdateUserRoleDto) {
    try {
      const existingUser = await this.userRepository.findOneBy({ id });

      if (!existingUser) {
        this.logger.warn(`User with id ${id} not found`);
        throw new NotFoundException('User not found');
      }

      const updated = this.userRepository.merge(existingUser, {
        role: { id: updateUserRoleDto.roleId },
      });

      return await this.userRepository.save(updated);
    } catch (error) {
      this.logger.error('Error during update user role', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Update user failed');
    }
  }
}
