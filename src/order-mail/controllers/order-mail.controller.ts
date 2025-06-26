import { Controller, Post, Body } from '@nestjs/common';
import { OrderMailService } from '../services/order-mail.service';
import { CreateOrderMailDto } from '../dto/create-order-mail.dto';

@Controller('order-mail')
export class OrderMailController {
  constructor(private readonly orderMailService: OrderMailService) {}

  @Post()
  create(@Body() createOrderMailDto: CreateOrderMailDto) {
    return this.orderMailService.create(createOrderMailDto);
  }
}
