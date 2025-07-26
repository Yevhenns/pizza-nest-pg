import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { ResendVerificationDto } from '../dto/resend-verification.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GoogleAuthDto } from '../dto/google-auth.dto';
import { CreateUserDto } from '~/user/dto/create-user.dto';
import { SuccessDto } from '~/dto/success.dto';
import { AuthService } from '../services/auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google-auth')
  @ApiOperation({ summary: 'Login user by google' })
  @ApiResponse({
    status: 201,
    description: 'Returns token',
    type: String,
  })
  googleAuth(@Body() googleAuthDto: GoogleAuthDto) {
    return this.authService.googleAuth(googleAuthDto);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register user by email' })
  @ApiResponse({
    status: 201,
    description:
      'Returns object {message: "User registered successfully. Verification email sent."}',
    type: SuccessDto,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user by email' })
  @ApiResponse({
    status: 201,
    description: 'Returns token',
    type: String,
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('verify/:token')
  @ApiOperation({ summary: 'Verify user by email' })
  @ApiResponse({
    status: 200,
    description: "Returns object { message: 'Email verified successfully' }",
    type: SuccessDto,
  })
  verifyEmail(@Param('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Get new verify token' })
  @ApiResponse({
    status: 201,
    description:
      'Returns object {message: "Verification email has been resent."}',
    type: SuccessDto,
  })
  resendEmailVerification(
    @Body() resendVerificationDto: ResendVerificationDto,
  ) {
    return this.authService.resendEmailVerification(resendVerificationDto);
  }
}
