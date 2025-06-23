import { Controller, Post, Body } from '@nestjs/common';
import { RegisterService } from './services/register/register.service';
import { RegisterDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly registerService: RegisterService) {}

  @Post()
  create(@Body() registerDto: RegisterDto) {
    return this.registerService.register(registerDto);
  }
}
