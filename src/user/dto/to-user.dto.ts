import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class ToUserDto extends PickType(CreateUserDto, [
  'name',
  'email',
  'phone',
  'avatar',
]) {}
