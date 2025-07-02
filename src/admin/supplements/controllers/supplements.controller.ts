import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SupplementsService } from '../services/supplements.service';
import { CreateSupplementDto } from '../dto/create-supplement.dto';
import { UpdateSupplementDto } from '../dto/update-supplement.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '~/auth/guards/jwt-auth.guard';
import { AdminGuard } from '~/auth/guards/admin.guard';
import { SuccessDto } from '~/dto/success.dto';

@Controller('admin/supplements')
export class SupplementsController {
  constructor(private readonly supplementsService: SupplementsService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Create supplement' })
  @ApiResponse({
    status: 201,
    description: 'Returns created supplement',
    type: CreateSupplementDto,
  })
  create(@Body() createSupplementDto: CreateSupplementDto) {
    return this.supplementsService.create(createSupplementDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Update supplement' })
  @ApiResponse({
    status: 200,
    description: 'Returns updated supplement',
    type: CreateSupplementDto,
  })
  update(
    @Param('id') id: string,
    @Body() updateSupplementDto: UpdateSupplementDto,
  ) {
    return this.supplementsService.update(+id, updateSupplementDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Delete supplement by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns object { message: "Supplement with ID # removed" }',
    type: SuccessDto,
  })
  remove(@Param('id') id: string) {
    return this.supplementsService.remove(+id);
  }
}
