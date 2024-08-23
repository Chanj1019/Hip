import { Test, TestingModule } from '@nestjs/testing';
import { DocNameController } from './doc_name.controller';
import { DocNameService } from './doc_name.service';

describe('DocNameController', () => {
  let controller: DocNameController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocNameController],
      providers: [DocNameService],
    }).compile();

    controller = module.get<DocNameController>(DocNameController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
