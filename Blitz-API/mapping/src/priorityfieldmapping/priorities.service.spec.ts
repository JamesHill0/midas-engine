import { Test, TestingModule } from '@nestjs/testing';
import { PriorityFieldMappingsService } from './priority.field.mappings.service';

describe('PriorityFieldMappingsService', () => {
    let service: PriorityFieldMappingsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PriorityFieldMappingsService],
        }).compile();

        service = module.get<PriorityFieldMappingsService>(PriorityFieldMappingsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
