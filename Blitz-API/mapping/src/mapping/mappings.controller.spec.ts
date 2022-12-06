import { Test, TestingModule } from '@nestjs/testing';
import { MappingsController } from './mappings.controller';

describe('Mappings Controller', () => {
    let controller: MappingsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MappingsController],
        }).compile();

        controller = module.get<MappingsController>(MappingsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
})