import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitionsMemberController } from './exhibitions_member.controller';
import { ExhibitionsMemberService } from './exhibitions_member.service';

describe('ExhibitionsMemberController', () => {
  let controller: ExhibitionsMemberController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExhibitionsMemberController],
      providers: [ExhibitionsMemberService],
    }).compile();

    controller = module.get<ExhibitionsMemberController>(ExhibitionsMemberController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
