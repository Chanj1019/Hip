import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitionController } from './exhibitions.controller';

describe('ExhibitionController', () => {
  let controller: ExhibitionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExhibitionController],
    }).compile();

    controller = module.get<ExhibitionController>(ExhibitionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
