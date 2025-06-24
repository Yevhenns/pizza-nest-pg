import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { RegisterService } from './services/register/register.service';
import { RegisterDto } from './dto/create-auth.dto';
import { VerificationTokenService } from './services/verification-token/verification-token.service';
import { VerifyService } from './verify/verify.service';
import { ResendVerificationDto } from './dto/resend-verification.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly registerService: RegisterService,
    private readonly verificationTokenService: VerificationTokenService,
    private readonly verifyService: VerifyService,
  ) {}

  @Post('register')
  create(@Body() registerDto: RegisterDto) {
    return this.registerService.register(registerDto);
  }

  @Post('resend-verification')
  resendEmailVerification(
    @Body() resendVerificationDto: ResendVerificationDto,
  ) {
    return this.verificationTokenService.resendEmailVerification(
      resendVerificationDto,
    );
  }

  @Get('verify/:token')
  verifyEmail(@Param('token') token: string) {
    return this.verifyService.verifyEmail(token);
  }
}
