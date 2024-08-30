import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitionIntroService } from './exhibition_intro.service';

describe('ExhibitionIntroService', () => {
  let service: ExhibitionIntroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExhibitionIntroService],
    }).compile();

    service = module.get<ExhibitionIntroService>(ExhibitionIntroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
