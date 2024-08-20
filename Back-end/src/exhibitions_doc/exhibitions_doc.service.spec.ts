import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitionsDocService } from './exhibitions_doc.service';

describe('ExhibitionsDocService', () => {
  let service: ExhibitionsDocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExhibitionsDocService],
    }).compile();

    service = module.get<ExhibitionsDocService>(ExhibitionsDocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
