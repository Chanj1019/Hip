import { Test, TestingModule } from '@nestjs/testing';
import { ProjectKeyDocService } from './project_key_doc.service';

describe('ProjectKeyDocService', () => {
  let service: ProjectKeyDocService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProjectKeyDocService],
    }).compile();

    service = module.get<ProjectKeyDocService>(ProjectKeyDocService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
