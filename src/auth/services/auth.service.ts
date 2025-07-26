import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '~/roles/entities/role.entity';
import { User } from '~/user/entities/user.entity';
import { GoogleAuthDto } from '../dto/google-auth.dto';
import { OAuth2Client } from 'google-auth-library';
import { UserRole } from '~/roles/interfaces/role.interface';
import { CreateUserDto } from '~/user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { EmailService } from '~/email/email.service';
import { LoginDto } from '../dto/login.dto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';
import { CustomJwtPayload } from '../interfaces/auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private jwtSecret = process.env.JWT_SECRET as string;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async googleAuth(googleAuthDto: GoogleAuthDto) {
    if (!googleAuthDto) {
      throw new BadRequestException('Missing token');
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;

    if (!clientId) {
      throw new InternalServerErrorException(
        'Google Client ID is not defined in environment variables',
      );
    }

    const client = new OAuth2Client(clientId);

    try {
      const ticket = await client.verifyIdToken({
        idToken: googleAuthDto.token,
        audience: clientId,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        this.logger.warn('Invalid Google token');
        throw new UnauthorizedException('Invalid Google token');
      }

      let user = await this.userRepository.findOne({
        where: { email: payload.email },
        relations: ['role'],
      });

      if (!user) {
        const userRole = await this.roleRepository.findOneBy({
          name: UserRole.USER,
        });

        if (!userRole) {
          this.logger.warn('Role not found');
          throw new NotFoundException('Role not found');
        }

        user = this.userRepository.create({
          name: payload.name,
          email: payload.email,
          verified: true,
          role: userRole,
        });

        await this.userRepository.save(user);
      }

      const token = await this.jwtService.signAsync({
        userId: user.id,
        email: user.email,
        role: user.role.name,
      });

      return token;
    } catch (error) {
      this.logger.error('Failed to send verification email', error);
      throw new Error('Email sending failed');
    }
  }

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

  async resendEmailVerification(
    resendVerificationDto: ResendVerificationDto,
  ): Promise<{
    message: string;
  }> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { email: resendVerificationDto.email },
        relations: ['role'],
      });

      if (!existingUser) {
        this.logger.warn(
          `User with email ${resendVerificationDto.email} not found`,
        );
        throw new NotFoundException('User not found');
      }

      if (existingUser.verified) {
        this.logger.warn(
          `User with email ${resendVerificationDto.email} is already verified`,
        );
        throw new ConflictException('Email already in use');
      }

      if (!existingUser.verified) {
        const verifyToken = await this.jwtService.signAsync({
          userId: existingUser.id,
          email: existingUser.email,
        });

        existingUser.verificationToken = verifyToken;
        await this.userRepository.save(existingUser);

        await this.emailService.sendVerifyEmail(
          existingUser.email,
          verifyToken,
        );
      }
      return {
        message: 'Verification email has been resent.',
      };
    } catch (error) {
      this.logger.error('Error generating verification token', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Could not generate verification token',
      );
    }
  }

  private verifyToken(token: string): CustomJwtPayload {
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      return jwt.verify(token, this.jwtSecret) as CustomJwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException(`Token expired}`);
      }
      throw new UnauthorizedException('Invalid token');
    }
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    try {
      const payload = this.verifyToken(token);
      console.log(payload);

      if (!payload || !payload.userId || !payload.email) {
        this.logger.warn('Invalid token payload');
        throw new UnauthorizedException('Invalid token payload');
      }

      const existingUser = await this.userRepository.findOne({
        where: { email: payload.email },
        relations: ['role'],
      });
      if (!existingUser) {
        this.logger.warn(`User not found for email: ${payload.email}`);
        throw new UnauthorizedException('Invalid token: user not found');
      }

      existingUser.verified = true;
      existingUser.verificationToken = null;

      await this.userRepository.save(existingUser);

      return { message: 'Email verified successfully' };
    } catch (error) {
      this.logger.error('Error generating verification token', error);

      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'An error occurred while verifying the email.',
      );
    }
  }
}
