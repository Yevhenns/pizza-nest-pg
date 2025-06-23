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
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {
    const email = process.env.EMAIL;
    const password = process.env.PASSWORD;

    if (!email || !password) {
      throw new Error(
        'EMAIL or PASSWORD is not defined in environment variables',
      );
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: password,
      },
    });
  }

  async sendVerifyEmail(email: string, token: string, baseUrl: string) {
    const mailOptions = {
      from: email,
      to: email,
      subject: 'Email Confirmation',
      html: `<p>To confirm your email, please <a href="${baseUrl}/verify/${token}">click here</a>.</p>`,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${info.response}`);
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

        await this.sendVerifyEmail(
          existingUser.email,
          verifyToken,
          this.baseUrl,
        );

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

      await this.sendVerifyEmail(createdUser.email, verifyToken, this.baseUrl);

      return {
        message: 'User registered successfully. Verification email sent.',
      };
    } catch (error) {
      this.logger.error('Error during registration', error);
      throw error;
    }
  }
}
