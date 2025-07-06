import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsOptional, IsUrl } from 'class-validator';

export class ToUserDto extends PickType(CreateUserDto, [
  'name',
  'email',
  'phone',
]) {
  @ApiProperty({
    description: 'User avatar URL',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  avatar: string;
}
