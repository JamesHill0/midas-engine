import { Test, TestingModule } from '@nestjs/testing';
import { SmartFilesController } from './smartfiles.controller';

describe('SmartFiles Controller', () => {
  let controller: SmartFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SmartFilesController],
    }).compile();

    controller = module.get<SmartFilesController>(SmartFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
