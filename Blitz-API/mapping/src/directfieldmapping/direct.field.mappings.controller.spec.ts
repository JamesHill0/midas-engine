import { Test, TestingModule } from '@nestjs/testing';
import { DirectFieldMappingsController } from './direct.field.mappings.controller';

describe('Direct Field Mappings Controller', () => {
  let controller: DirectFieldMappingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DirectFieldMappingsController],
    }).compile();

    controller = module.get<DirectFieldMappingsController>(DirectFieldMappingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  })
})
