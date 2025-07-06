import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'User name',
    example: 'Alex',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'alex@gmail.com',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Abcd1234!',
    required: true,
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'User phone number',
    example: '380931234568',
    required: true,
  })
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @ApiHideProperty()
  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }: { value: string }) =>
    value ? parseInt(value) : undefined,
  )
  roleId: number;
}
