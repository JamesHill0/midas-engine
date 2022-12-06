import { Test, TestingModule } from '@nestjs/testing';
import { SalesforcesService } from './salesforces.service';

describe('SalesforcesService Service', () => {
  let service: SalesforcesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SalesforcesService],
    }).compile();

    service = module.get<SalesforcesService>(SalesforcesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
