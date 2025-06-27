import { Controller, Get, Param } from '@nestjs/common';
import { SupplementsService } from '../services/supplements.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Supplement } from '../entities/supplement.entity';

@Controller('supplements')
export class SupplementsController {
  constructor(private readonly supplementsService: SupplementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get supplements list' })
  @ApiResponse({
    status: 200,
    description: 'Returns supplements list',
    type: Supplement,
    isArray: true,
  })
  findAll() {
    return this.supplementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get supplement by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns supplement by ID',
    type: Supplement,
  })
  findOne(@Param('id') id: string) {
    return this.supplementsService.findOne(+id);
  }
}
