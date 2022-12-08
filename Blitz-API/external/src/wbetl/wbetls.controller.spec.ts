import { Test, TestingModule } from '@nestjs/testing';
import { WbEtlsController } from './wbetls.controller';

describe('WbEtls Controller', () => {
    let controller: WbEtlsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [WbEtlsController],
        }).compile();

        controller = module.get<WbEtlsController>(WbEtlsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
})
