import { Controller, Get, Param } from '@nestjs/common';
import { SupplementsService } from '../services/supplements.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSupplementDto } from '~/admin/supplements/dto/create-supplement.dto';

@Controller('supplements')
export class SupplementsController {
  constructor(private readonly supplementsService: SupplementsService) {}

  @Get()
  @ApiOperation({ summary: 'Get supplements list' })
  @ApiResponse({
    status: 200,
    description: 'Returns supplements list',
    type: [CreateSupplementDto],
  })
  findAll() {
    return this.supplementsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get supplement by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns supplement by ID',
    type: CreateSupplementDto,
  })
  findOne(@Param('id') id: string) {
    return this.supplementsService.findOne(+id);
  }
}
