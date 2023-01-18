import { Test, TestingModule } from '@nestjs/testing';
import { AccountMappingsController } from './account.mappings.controller';

describe('Account Mappings Controller', () => {
  let controller: AccountMappingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountMappingsController],
    }).compile();

    controller = module.get<AccountMappingsController>(AccountMappingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
