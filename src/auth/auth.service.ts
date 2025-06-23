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
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(AuthService.name);

  async register(registerDto: RegisterDto): Promise<{
    message: string;
  }> {
    try {
      const userRole = await this.roleRepository.findOneBy({
        name: UserRole.USER,
      });
      if (!userRole) {
        this.logger.warn(`Role with id ${registerDto.roleId} not found`);
        throw new NotFoundException('Role not found');
      }

      const existingUser = await this.userRepository.findOne({
        where: { email: registerDto.email },
        relations: ['role'],
      });
      if (existingUser && existingUser.verified) {
        throw new ConflictException('Email already in use');
      }

      if (existingUser && !existingUser.verified) {
        this.logger.warn(
          `User with email ${registerDto.email} already exists but is not verified`,
        );
        const verifyToken = await this.jwtService.signAsync({
          id: existingUser.id,
          name: existingUser.role.name,
        });

        existingUser.verificationToken = verifyToken;
        await this.userRepository.save(existingUser);

        return {
          message:
            'Account exists but not verified. Verification email resent.',
        };
      }

      const hashPassword = await bcrypt.hash(registerDto.password, 10);

      const newUser = this.userRepository.create({
        ...registerDto,
        password: hashPassword,
        role: userRole,
      });
      const createdUser = await this.userRepository.save(newUser);

      const verifyToken = await this.jwtService.signAsync({
        id: createdUser.id,
        name: createdUser.role.name,
      });

      createdUser.verificationToken = verifyToken;
      await this.userRepository.save(createdUser);

      return { message: 'User registered successfully' };
    } catch (error) {
      this.logger.error('Error during registration', error);
      throw error;
    }
  }
}
