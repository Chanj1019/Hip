import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitionIntroService } from './exhibition_intro.service';
import { ExhibitionIntro } from './entities/exhibition_intro.entity';
import { Exhibition } from '../exhibitions/exhibition.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateExhibitionIntroDto } from './dto/create-exhibition_intro.dto';
import { UpdateExhibitionIntroDto } from './dto/update-exhibition_intro.dto';

describe('ExhibitionIntroService', () => {
  let service: ExhibitionIntroService;
  let exhibitionIntroRepository: Repository<ExhibitionIntro>;
  let exhibitionRepository: Repository<Exhibition>;

  const mockExhibitionIntroRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockExhibitionRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExhibitionIntroService,
        {
          provide: getRepositoryToken(ExhibitionIntro),
          useValue: mockExhibitionIntroRepository,
        },
        {
          provide: getRepositoryToken(Exhibition),
          useValue: mockExhibitionRepository,
        },
      ],
    }).compile();

    service = module.get<ExhibitionIntroService>(ExhibitionIntroService);
    exhibitionIntroRepository = module.get<Repository<ExhibitionIntro>>(getRepositoryToken(ExhibitionIntro));
    exhibitionRepository = module.get<Repository<Exhibition>>(getRepositoryToken(Exhibition));
  });

  describe('create', () => {
    it('should create a new ExhibitionIntro', async () => {
      const createDto: CreateExhibitionIntroDto = {
        exhibition_id: 1,
        introduce: ''
      };
      const exhibition = new Exhibition();
      exhibition.exhibition_id = 1;

      mockExhibitionRepository.findOne.mockResolvedValue(exhibition);
      mockExhibitionIntroRepository.create.mockReturnValue(new ExhibitionIntro());
      mockExhibitionIntroRepository.save.mockResolvedValue(new ExhibitionIntro());

      const result = await service.create(createDto);
      expect(result).toBeInstanceOf(ExhibitionIntro);
      expect(mockExhibitionRepository.findOne).toHaveBeenCalledWith({ where: { exhibition_id: 1 } });
    });

    it('should throw NotFoundException if exhibition not found', async () => {
      const createDto: CreateExhibitionIntroDto = {
        exhibition_id: 1,
        introduce: ''
      };

      mockExhibitionRepository.findOne.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of ExhibitionIntro', async () => {
      const exhibitionIntros = [new ExhibitionIntro(), new ExhibitionIntro()];
      mockExhibitionIntroRepository.find.mockResolvedValue(exhibitionIntros);

      const result = await service.findAll();
      expect(result).toEqual(exhibitionIntros);
    });
  });

  describe('findOne', () => {
    it('should return an ExhibitionIntro', async () => {
      const exhibitionIntro = new ExhibitionIntro();
      exhibitionIntro.exhibition_intro_id = 1;

      mockExhibitionIntroRepository.findOne.mockResolvedValue(exhibitionIntro);

      const result = await service.findOne(1);
      expect(result).toEqual(exhibitionIntro);
    });

    it('should throw NotFoundException if exhibitionIntro not found', async () => {
      mockExhibitionIntroRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an ExhibitionIntro', async () => {
      const existingIntro = new ExhibitionIntro();
      existingIntro.exhibition_intro_id = 1;

      const updateDto: UpdateExhibitionIntroDto = { /* 업데이트할 속성 추가 */ };
      mockExhibitionIntroRepository.findOne.mockResolvedValue(existingIntro);
      mockExhibitionIntroRepository.update.mockResolvedValue(undefined);
      mockExhibitionIntroRepository.findOne.mockResolvedValue(existingIntro);

      const result = await service.update(1, updateDto);
      expect(result).toEqual(existingIntro);
    });

    it('should throw NotFoundException if exhibitionIntro not found', async () => {
      mockExhibitionIntroRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an ExhibitionIntro', async () => {
      const existingIntro = new ExhibitionIntro();
      existingIntro.exhibition_intro_id = 1;

      mockExhibitionIntroRepository.findOne.mockResolvedValue(existingIntro);
      mockExhibitionIntroRepository.remove.mockResolvedValue(undefined);

      await service.remove(1);
      expect(mockExhibitionIntroRepository.remove).toHaveBeenCalledWith(existingIntro);
    });

    it('should throw NotFoundException if exhibitionIntro not found', async () => {
      mockExhibitionIntroRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
