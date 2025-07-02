import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsStrongPassword } from 'class-validator';

export class ChangePasswordDto extends PickType(CreateUserDto, ['password']) {
  @ApiProperty({
    description: 'User password',
    example: 'Abcd1234!',
    required: true,
  })
  @IsStrongPassword()
  @IsNotEmpty()
  newPassword: string;
}
