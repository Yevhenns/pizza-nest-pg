import { Controller, Post, Body } from '@nestjs/common';
import { OrderMailService } from '../services/order-mail.service';
import { CreateOrderMailDto } from '../dto/create-order-mail.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('order-mail')
export class OrderMailController {
  constructor(private readonly orderMailService: OrderMailService) {}

  @Post()
  @ApiOperation({ summary: 'Send order by email' })
  @ApiResponse({
    status: 201,
    description: 'Returns object { success: true }',
    type: Object,
  })
  create(@Body() createOrderMailDto: CreateOrderMailDto) {
    return this.orderMailService.create(createOrderMailDto);
  }
}
