import { Test, TestingModule } from '@nestjs/testing';
import { OrderMailService } from './order-mail.service';

describe('OrderMailService', () => {
  let service: OrderMailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderMailService],
    }).compile();

    service = module.get<OrderMailService>(OrderMailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
