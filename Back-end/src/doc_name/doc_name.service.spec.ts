import { Test, TestingModule } from '@nestjs/testing';
import { DocNameService } from './doc_name.service';

describe('DocNameService', () => {
  let service: DocNameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocNameService],
    }).compile();

    service = module.get<DocNameService>(DocNameService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
