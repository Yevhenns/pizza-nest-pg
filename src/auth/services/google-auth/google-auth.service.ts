import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OAuth2Client } from 'google-auth-library';
import { GoogleAuthDto } from 'src/auth/dto/google-auth.dto';
import { User } from 'src/auth/entities/auth.entity';
import { Role } from 'src/roles/entities/role.entity';
import { UserRole } from 'src/roles/interfaces/role.interface';
import { Repository } from 'typeorm';

@Injectable()
export class GoogleAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(GoogleAuthService.name);

  async googleAuth(googleAuthDto: GoogleAuthDto) {
    if (!googleAuthDto) {
      throw new HttpException('Missing token', HttpStatus.BAD_REQUEST);
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
        throw new HttpException(
          'Invalid Google token',
          HttpStatus.UNAUTHORIZED,
        );
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
          this.logger.warn(`Role not found`);
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
}
