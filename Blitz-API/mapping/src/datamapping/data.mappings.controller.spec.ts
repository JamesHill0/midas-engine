import { Test, TestingModule } from '@nestjs/testing';
import { DataMappingsController } from './data.mappings.controller';

describe('Data Mappings Controller', () => {
  let controller: DataMappingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataMappingsController],
    }).compile();

    controller = module.get<DataMappingsController>(DataMappingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  })
})
