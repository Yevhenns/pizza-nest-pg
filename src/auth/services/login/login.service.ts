import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from 'src/auth/dto/login.dto';
import { User } from 'src/auth/entities/auth.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async login(loginDto: LoginDto) {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: loginDto.email },
        relations: ['role'],
      });
      if (!existingUser) {
        this.logger.warn(`User with email ${loginDto.email} not found`);
        throw new NotFoundException('User not found');
      }

      if (!existingUser.verified) {
        this.logger.warn(`Email already in use but is not verified`);
        throw new ConflictException('Email already in use but is not verified');
      }
    } catch (error) {
      this.logger.error('Error during login', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Login failed');
    }
  }
}
