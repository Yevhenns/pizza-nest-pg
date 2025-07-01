import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { RegisterService } from '../services/register/register.service';
import { LoginService } from '../services/login/login.service';
import { VerifyService } from '../services/verify/verify.service';
import { VerificationTokenService } from '../services/verification-token/verification-token.service';
import { LoginDto } from '../dto/login.dto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GoogleAuthDto } from '../dto/google-auth.dto';
import { GoogleAuthService } from '../services/google-auth/google-auth.service';
import { CreateUserDto } from '~/user/dto/create-user.dto';

@Controller()
export class AuthController {
  constructor(
    private readonly googleAuthService: GoogleAuthService,
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly verifyService: VerifyService,
    private readonly verificationTokenService: VerificationTokenService,
  ) {}

  @Post('google-auth')
  @ApiOperation({ summary: 'Login user by google' })
  @ApiResponse({
    status: 201,
    description: 'Returns token',
    type: String,
  })
  googleAuth(@Body() googleAuthDto: GoogleAuthDto) {
    return this.googleAuthService.googleAuth(googleAuthDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user by email' })
  @ApiResponse({
    status: 201,
    description:
      'Returns object {message: "User registered successfully. Verification email sent."}',
    type: Object,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.registerService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user by email' })
  @ApiResponse({
    status: 201,
    description: 'Returns token',
    type: String,
  })
  login(@Body() loginDto: LoginDto) {
    return this.loginService.login(loginDto);
  }

  @Get('verify/:token')
  @ApiOperation({ summary: 'Verify user by email' })
  @ApiResponse({
    status: 200,
    description: "Returns object { message: 'Email verified successfully' }",
    type: Object,
  })
  verifyEmail(@Param('token') token: string) {
    return this.verifyService.verifyEmail(token);
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Get new verify token' })
  @ApiResponse({
    status: 201,
    description:
      'Returns object {message: "Verification email has been resent."}',
    type: Object,
  })
  resendEmailVerification(
    @Body() resendVerificationDto: ResendVerificationDto,
  ) {
    return this.verificationTokenService.resendEmailVerification(
      resendVerificationDto,
    );
  }
}
