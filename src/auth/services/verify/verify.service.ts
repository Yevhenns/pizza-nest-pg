import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../../interfaces/auth.interface';
import { User } from '~/user/entities/user.entity';

@Injectable()
export class VerifyService {
  private readonly logger = new Logger(VerifyService.name);
  private jwtSecret = process.env.JWT_SECRET as string;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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
