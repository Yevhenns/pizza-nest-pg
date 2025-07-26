import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderMailService } from '../services/order-mail.service';

describe('OrderMailController', () => {
  let controller: OrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [OrderMailService],
    }).compile();

    controller = module.get<OrderController>(OrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
