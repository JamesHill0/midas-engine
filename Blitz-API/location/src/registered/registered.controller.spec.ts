import { Test, TestingModule } from '@nestjs/testing';
import { RegisteredController } from './registered.controller';

describe('Registered Controller', () => {
  let controller: RegisteredController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisteredController],
    }).compile();

    controller = module.get<RegisteredController>(RegisteredController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
