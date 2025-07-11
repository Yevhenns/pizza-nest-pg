import { Module } from '@nestjs/common';
import { RegisterService } from './services/register/register.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './services/email/email.service';
import { VerifyService } from './services/verify/verify.service';
import { VerificationTokenService } from './services/verification-token/verification-token.service';
import { LoginService } from './services/login/login.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './controllers/auth.controller';
import { GoogleAuthService } from './services/google-auth/google-auth.service';
import { User } from '~/user/entities/user.entity';
import { Role } from '~/roles/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '60m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    RegisterService,
    EmailService,
    VerifyService,
    VerificationTokenService,
    LoginService,
    GoogleAuthService,
  ],
})
export class AuthModule {}
