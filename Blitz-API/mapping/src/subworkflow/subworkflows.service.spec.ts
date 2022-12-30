import { Test, TestingModule } from '@nestjs/testing';
import { SubworkflowsService } from './subworkflows.service';

describe('Subworkflows Service', () => {
  let service: SubworkflowsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubworkflowsService],
    }).compile();

    service = module.get<SubworkflowsService>(SubworkflowsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
