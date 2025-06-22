import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { UserRole } from '../interfaces/role.interface';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Name of the user role',
    example: UserRole.ADMIN,
    required: true,
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  name: UserRole;

  @ApiProperty({
    description: 'Description of the user role',
    example: 'Administrator can manage all aspects of the system',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  description: string;
}
