import { Test, TestingModule } from '@nestjs/testing';
import { WbEtlsService } from './wbetls.service';

describe('WbEtlsService', () => {
  let service: WbEtlsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WbEtlsService],
    }).compile();

    service = module.get<WbEtlsService>(WbEtlsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
