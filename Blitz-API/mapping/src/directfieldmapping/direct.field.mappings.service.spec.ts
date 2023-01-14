import { Test, TestingModule } from '@nestjs/testing';
import { DirectFieldMappingsService } from './direct.field.mappings.service';

describe('Direct Field Mappings Service', () => {
  let service: DirectFieldMappingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DirectFieldMappingsService],
    }).compile();

    service = module.get<DirectFieldMappingsService>(DirectFieldMappingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  })
})
