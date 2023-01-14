import { Test, TestingModule } from '@nestjs/testing';
import { DataMappingsService } from './data.mappings.service';

describe('Data Mappings Service', () => {
  let service: DataMappingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataMappingsService],
    }).compile();

    service = module.get<DataMappingsService>(DataMappingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  })
})
