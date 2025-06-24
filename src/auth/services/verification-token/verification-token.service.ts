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
import { User } from '../../entities/auth.entity';
import { EmailService } from '../email/email.service';
import { JwtService } from '@nestjs/jwt';
import { ResendVerificationDto } from 'src/auth/dto/resend-verification.dto';

@Injectable()
export class VerificationTokenService {
  private readonly logger = new Logger(VerificationTokenService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

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
}
