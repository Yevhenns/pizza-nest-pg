import { PickType } from '@nestjs/swagger';
import { RegisterDto } from './create-auth.dto';

export class LoginDto extends PickType(RegisterDto, ['email', 'password']) {}
