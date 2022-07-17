import { Test, TestingModule } from '@nestjs/testing';
import { HolesService } from './holes.service';

describe('HolesService', () => {
  let service: HolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HolesService],
    }).compile();

    service = module.get<HolesService>(HolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
