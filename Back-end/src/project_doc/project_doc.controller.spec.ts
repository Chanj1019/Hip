import { Test, TestingModule } from '@nestjs/testing';
import { ProjectDocController } from './project_doc.controller';

describe('ProjectDocController', () => {
  let controller: ProjectDocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectDocController],
    }).compile();

    controller = module.get<ProjectDocController>(ProjectDocController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
