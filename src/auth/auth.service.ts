import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RegisterDto } from './dto/create-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/roles/entities/role.entity';
import * as bcrypt from 'bcrypt';
import { UserRole } from 'src/roles/interfaces/role.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async register(registerDto: RegisterDto): Promise<User> {
    try {
      const userRole = await this.roleRepository.findOneBy({
        name: UserRole.USER,
      });
      if (!userRole) {
        this.logger.warn(`Role with id ${registerDto.roleId} not found`);
        throw new NotFoundException('Role not found');
      }

      const existingUser = await this.userRepository.findOneBy({
        email: registerDto.email,
      });
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }

      const hashPassword = await bcrypt.hash(registerDto.password, 10);

      const newUser = this.userRepository.create({
        ...registerDto,
        password: hashPassword,
        role: userRole,
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.logger.error('Error during registration', error);
      throw error;
    }
  }
}
