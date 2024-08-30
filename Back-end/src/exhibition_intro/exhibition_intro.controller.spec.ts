import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitionIntroController } from './exhibition_intro.controller';
import { ExhibitionIntroService } from './exhibition_intro.service';

describe('ExhibitionIntroController', () => {
  let controller: ExhibitionIntroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExhibitionIntroController],
      providers: [ExhibitionIntroService],
    }).compile();

    controller = module.get<ExhibitionIntroController>(ExhibitionIntroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
