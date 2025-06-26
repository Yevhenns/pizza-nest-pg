import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { RegisterService } from '../services/register/register.service';
import { LoginService } from '../services/login/login.service';
import { VerifyService } from '../services/verify/verify.service';
import { VerificationTokenService } from '../services/verification-token/verification-token.service';
import { RegisterDto } from '../dto/create-auth.dto';
import { LoginDto } from '../dto/login.dto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly verifyService: VerifyService,
    private readonly verificationTokenService: VerificationTokenService,
  ) {}

  @Post('register')
  create(@Body() registerDto: RegisterDto) {
    return this.registerService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.loginService.login(loginDto);
  }

  @Get('verify/:token')
  verifyEmail(@Param('token') token: string) {
    return this.verifyService.verifyEmail(token);
  }

  @Post('resend-verification')
  resendEmailVerification(
    @Body() resendVerificationDto: ResendVerificationDto,
  ) {
    return this.verificationTokenService.resendEmailVerification(
      resendVerificationDto,
    );
  }
}
