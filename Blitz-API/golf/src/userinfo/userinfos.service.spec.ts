import { Test, TestingModule } from '@nestjs/testing';
import { UserInfosService } from './userinfos.service';

describe('User Info Service', () => {
    let service: UserInfosService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [UserInfosService],
        }).compile();

        service = module.get<UserInfosService>(UserInfosService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});