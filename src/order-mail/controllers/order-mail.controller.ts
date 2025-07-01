import { Controller, Post, Body, Req } from '@nestjs/common';
import { OrderMailService } from '../services/order-mail.service';
import { CreateOrderMailDto } from '../dto/create-order-mail.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('order-mail')
export class OrderMailController {
  constructor(private readonly orderMailService: OrderMailService) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Send order by email',
    description:
      'Anyone can send an order. If a valid JWT token is provided, the order will also be saved to the database and linked to the authenticated user.',
  })
  @ApiResponse({
    status: 201,
    description: 'Returns object { success: true }',
    type: Object,
  })
  create(@Req() req: Request, @Body() createOrderMailDto: CreateOrderMailDto) {
    return this.orderMailService.create(req, createOrderMailDto);
  }
}
