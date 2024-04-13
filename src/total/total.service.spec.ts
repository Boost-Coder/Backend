import { Test, TestingModule } from '@nestjs/testing';
import { TotalService } from './total.service';

describe('TotalService', () => {
    let service: TotalService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TotalService],
        }).compile();

        service = module.get<TotalService>(TotalService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
