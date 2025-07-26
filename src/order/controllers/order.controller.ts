import { Controller, Post, Body, Req } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SuccessDto } from '~/common/dto/success.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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
    type: SuccessDto,
  })
  create(@Req() req: Request, @Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(req, createOrderDto);
  }
}
