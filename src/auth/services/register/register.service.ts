import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '~/roles/entities/role.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from '~/roles/interfaces/role.interface';
import { JwtService } from '@nestjs/jwt';

import { EmailService } from '../email/email.service';
import { User } from '~/user/entities/user.entity';
import { CreateUserDto } from '~/user/dto/create-user.dto';

@Injectable()
export class RegisterService {
  private readonly logger = new Logger(RegisterService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<{
    message: string;
  }> {
    try {
      const userRole = await this.roleRepository.findOneBy({
        name: UserRole.USER,
      });
      if (!userRole) {
        this.logger.warn(`Role with id ${createUserDto.roleId} not found`);
        throw new NotFoundException('Role not found');
      }

      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
        relations: ['role'],
      });

      if (existingUser && existingUser.verified) {
        this.logger.warn(`Email already in use`);
        throw new ConflictException('Email already in use');
      }

      if (existingUser && !existingUser.verified) {
        this.logger.warn(`Email already in use but is not verified`);
        throw new ConflictException('Email already in use but is not verified');
      }

      const hashPassword = await bcrypt.hash(createUserDto.password, 10);

      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashPassword,
        role: userRole,
      });
      const createdUser = await this.userRepository.save(newUser);

      const verifyToken = await this.jwtService.signAsync({
        userId: createdUser.id,
        email: createdUser.email,
      });

      createdUser.verificationToken = verifyToken;
      await this.userRepository.save(createdUser);

      await this.emailService.sendVerifyEmail(createdUser.email, verifyToken);

      return {
        message: 'User registered successfully. Verification email sent.',
      };
    } catch (error) {
      this.logger.error('Error during registration', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException('Registration failed');
    }
  }
}
