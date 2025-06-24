import { Module } from '@nestjs/common';
import { RegisterService } from './services/register/register.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/auth.entity';
import { Role } from 'src/roles/entities/role.entity';
import { JwtModule } from '@nestjs/jwt';
import { EmailService } from './services/email/email.service';
import { VerifyService } from './services/verify/verify.service';
import { VerificationTokenService } from './services/verification-token/verification-token.service';
import { LoginService } from './services/login/login.service';

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
    RegisterService,
    EmailService,
    VerifyService,
    VerificationTokenService,
    LoginService,
  ],
})
export class AuthModule {}
