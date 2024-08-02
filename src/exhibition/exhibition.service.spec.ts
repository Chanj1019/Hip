import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitionService } from './exhibition.service';

describe('ExhibitionService', () => {
  let service: ExhibitionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExhibitionService],
    }).compile();

    service = module.get<ExhibitionService>(ExhibitionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
