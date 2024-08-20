import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitionsDocController } from './exhibitions_doc.controller';
import { ExhibitionsDocService } from './exhibitions_doc.service';

describe('ExhibitionsDocController', () => {
  let controller: ExhibitionsDocController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExhibitionsDocController],
      providers: [ExhibitionsDocService],
    }).compile();

    controller = module.get<ExhibitionsDocController>(ExhibitionsDocController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
