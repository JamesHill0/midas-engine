import { Test, TestingModule } from '@nestjs/testing';
import { HolesController } from './holes.controller';

describe('Holes Controller', () => {
    let controller: HolesController;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [HolesController],
      }).compile();
  
      controller = module.get<HolesController>(HolesController);
    });
  
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });