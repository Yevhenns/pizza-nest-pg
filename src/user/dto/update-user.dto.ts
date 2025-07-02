import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['name', 'email', 'phone']),
) {
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  avatar: string;
}
