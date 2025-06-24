import { PickType } from '@nestjs/swagger';
import { RegisterDto } from './create-auth.dto';

export class ResendVerificationDto extends PickType(RegisterDto, ['email']) {}
