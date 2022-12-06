import { Test, TestingModule } from '@nestjs/testing';
import { UserInfosController } from './userinfos.controller';

describe('User Infos Controller', () => {
    let controller: UserInfosController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserInfosController],
        }).compile();

        controller = module.get<UserInfosController>(UserInfosController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});