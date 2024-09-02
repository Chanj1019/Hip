import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitionIntroController } from './exhibition_intro.controller';
import { ExhibitionIntroService } from './exhibition_intro.service';
import { CreateExhibitionIntroDto } from './dto/create-exhibition_intro.dto';
import { UpdateExhibitionIntroDto } from './dto/update-exhibition_intro.dto';

describe('ExhibitionIntroController', () => {
  let controller: ExhibitionIntroController;
  let service: ExhibitionIntroService;

  const mockExhibitionIntroService = {
    create: jest.fn().mockResolvedValue({ exhibition_intro_id: 1, introduce: 'Test Intro' }),
    findAll: jest.fn().mockResolvedValue([{ exhibition_intro_id: 1, introduce: 'Test Intro' }]),
    findOne: jest.fn().mockResolvedValue({ exhibition_intro_id: 1, introduce: 'Test Intro' }),
    update: jest.fn().mockResolvedValue({ exhibition_intro_id: 1, introduce: 'Updated Intro' }),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExhibitionIntroController],
      providers: [
        {
          provide: ExhibitionIntroService,
          useValue: mockExhibitionIntroService,
        },
      ],
    }).compile();

    controller = module.get<ExhibitionIntroController>(ExhibitionIntroController);
    service = module.get<ExhibitionIntroService>(ExhibitionIntroService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an exhibition intro', async () => {
      const dto: CreateExhibitionIntroDto = { exhibition_id: 1, introduce: 'Test Intro' };
      const result = await controller.create(dto);
      expect(result).toEqual({
        message: 'intro 생성이 완료되었습니다.',
        intro: { exhibition_intro_id: 1, introduce: 'Test Intro' },
      });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of exhibition intros', async () => {
      const result = await controller.findAll();
      expect(result).toEqual({
        message: '전체 조회가 완료되었습니다',
        intro: [{ exhibition_intro_id: 1, introduce: 'Test Intro' }],
      });
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single exhibition intro', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual({
        message: 'intro 조회를 완료했습니다',
        intro: { exhibition_intro_id: 1, introduce: 'Test Intro' },
      });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update an exhibition intro', async () => {
      const dto: UpdateExhibitionIntroDto = { introduce: 'Updated Intro' };
      const result = await controller.update('1', dto);
      expect(result).toEqual({
        message: 'intro가 성공적으로 업데이트되었습니다.',
        intro: { exhibition_intro_id: 1, introduce: 'Updated Intro' },
      });
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('should delete an exhibition intro', async () => {
      const result = await controller.remove('1');
      expect(result).toEqual({ message: 'intro가 삭제되었습니다' });
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
