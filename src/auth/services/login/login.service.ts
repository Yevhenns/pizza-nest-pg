import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginDto } from '~/auth/dto/login.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '~/user/entities/user.entity';

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<string> {
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

      const isPasswordValid = bcrypt.compareSync(
        loginDto.password,
        existingUser.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Incorrect password');
      }

      const token = await this.jwtService.signAsync({
        userId: existingUser.id,
        email: existingUser.email,
        role: existingUser.role.name,
      });

      return token;
    } catch (error) {
      this.logger.error('Error during login', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Login failed');
    }
  }
}
