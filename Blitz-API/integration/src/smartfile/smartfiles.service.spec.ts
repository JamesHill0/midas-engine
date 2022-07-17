import { Test, TestingModule } from '@nestjs/testing';
import { SmartFilesService } from './smartfiles.service';

describe('SmartFiles Service', () => {
  let service: SmartFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmartFilesService],
    }).compile();

    service = module.get<SmartFilesService>(SmartFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
