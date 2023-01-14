import { Test, TestingModule } from '@nestjs/testing';
import { PriorityFieldMappingsController } from './priority.field.mappings.controller';

describe('Priorities Controller', () => {
    let controller: PriorityFieldMappingsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PriorityFieldMappingsController],
        }).compile();

        controller = module.get<PriorityFieldMappingsController>(PriorityFieldMappingsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
