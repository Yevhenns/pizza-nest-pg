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
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private transporter: Transporter;
  private baseUrl = `http://localhost:${process.env.PORT || 3000}`;
  private email = process.env.EMAIL;
  private password = process.env.PASSWORD;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {
    if (!this.email || !this.password) {
      throw new Error(
        'EMAIL or PASSWORD is not defined in environment variables',
      );
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.email,
        pass: this.password,
      },
    });
  }

  async sendVerifyEmail(userEmail: string, token: string) {
    const mailOptions = {
      from: this.email,
      to: userEmail,
      subject: 'Email Confirmation',
      html: `<p>To confirm your email, please <a href="${this.baseUrl}/verify/${token}">click here</a>.</p>`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      this.logger.error('Failed to send verification email', error);
      throw new Error('Email sending failed');
    }
  }

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

        await this.sendVerifyEmail(existingUser.email, verifyToken);

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

      await this.sendVerifyEmail(createdUser.email, verifyToken);

      return {
        message: 'User registered successfully. Verification email sent.',
      };
    } catch (error) {
      this.logger.error('Error during registration', error);
      throw error;
    }
  }
}
