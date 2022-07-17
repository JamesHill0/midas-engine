import { Test, TestingModule } from '@nestjs/testing';
import { SalesforcesController } from './salesforces.controller';

describe('Salesforces Controller', () => {
  let controller: SalesforcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SalesforcesController],
    }).compile();

    controller = module.get<SalesforcesController>(SalesforcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
