import { Test, TestingModule } from '@nestjs/testing';
import { SubworkflowsController } from './subworkflows.controller';

describe('Subworkflows Controller', () => {
    let controller: SubworkflowsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SubworkflowsController],
        }).compile();

        controller = module.get<SubworkflowsController>(SubworkflowsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
})
