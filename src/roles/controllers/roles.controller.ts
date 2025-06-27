import { Controller, Get, Param } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RoleWithoutUsersDto } from '../entities/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Get roles list' })
  @ApiResponse({
    status: 200,
    description: 'Returns roles list',
    type: RoleWithoutUsersDto,
    isArray: true,
  })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns role by ID',
    type: RoleWithoutUsersDto,
  })
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }
}
