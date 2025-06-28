import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'Role ID',
    example: 2,
  })
  @IsInt()
  roleId: number;
}
