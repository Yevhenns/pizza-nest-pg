import { Controller, Get, Param } from '@nestjs/common';
import { SupplementsService } from '../services/supplements.service';

@Controller('supplements')
export class SupplementsController {
  constructor(private readonly supplementsService: SupplementsService) {}

  @Get()
  findAll() {
    return this.supplementsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.supplementsService.findOne(+id);
  }
}
