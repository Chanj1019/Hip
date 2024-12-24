import { Test, TestingModule } from '@nestjs/testing';
import { ProjectKeyDocController } from './project_key_doc.controller';
import { ProjectKeyDocService } from './project_key_doc.service';

describe('ProjectKeyDocController', () => {
  let controller: ProjectKeyDocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectKeyDocController],
      providers: [ProjectKeyDocService],
    }).compile();

    controller = module.get<ProjectKeyDocController>(ProjectKeyDocController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
