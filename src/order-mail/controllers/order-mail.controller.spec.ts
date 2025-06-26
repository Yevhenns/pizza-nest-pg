import { Test, TestingModule } from '@nestjs/testing';
import { OrderMailController } from './order-mail.controller';
import { OrderMailService } from '../services/order-mail.service';

describe('OrderMailController', () => {
  let controller: OrderMailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderMailController],
      providers: [OrderMailService],
    }).compile();

    controller = module.get<OrderMailController>(OrderMailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
