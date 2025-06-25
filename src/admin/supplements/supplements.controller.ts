import { Controller, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SupplementsService } from './supplements.service';
import { CreateSupplementDto } from './dto/create-supplement.dto';
import { UpdateSupplementDto } from './dto/update-supplement.dto';

@Controller('admin/supplements')
export class SupplementsController {
  constructor(private readonly supplementsService: SupplementsService) {}

  @Post()
  create(@Body() createSupplementDto: CreateSupplementDto) {
    return this.supplementsService.create(createSupplementDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplementDto: UpdateSupplementDto,
  ) {
    return this.supplementsService.update(+id, updateSupplementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.supplementsService.remove(+id);
  }
}
