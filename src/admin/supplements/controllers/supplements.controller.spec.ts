import { Test, TestingModule } from '@nestjs/testing';
import { SupplementsService } from '../services/supplements.service';
import { SupplementsController } from './supplements.controller';

describe('SupplementsController', () => {
  let controller: SupplementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplementsController],
      providers: [SupplementsService],
    }).compile();

    controller = module.get<SupplementsController>(SupplementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
