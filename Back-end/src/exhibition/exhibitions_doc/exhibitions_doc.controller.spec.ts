import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitionsDocController } from './exhibitions_doc.controller';
import { ExhibitionsDocService } from './exhibitions_doc.service';
import { CreateExhibitionsDocDto } from './dto/create-exhibitions_doc.dto';
import { UpdateExhibitionsDocDto } from './dto/update-exhibitions_doc.dto';
import { ExhibitionDoc } from './entities/exhibition_doc.entity';

describe('ExhibitionsDocController', () => {
  let controller: ExhibitionsDocController;
  let service: ExhibitionsDocService;

  const mockExhibitionDocService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    createExhibitionDoc: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExhibitionsDocController],
      providers: [
        {
          provide: ExhibitionsDocService,
          useValue: mockExhibitionDocService,
        },
      ],
    }).compile();

    controller = module.get<ExhibitionsDocController>(ExhibitionsDocController);
    service = module.get<ExhibitionsDocService>(ExhibitionsDocService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of exhibition docs', async () => {
      const result: ExhibitionDoc[] = [
        { exhibition_doc_id: 1, file_path: 'path/to/file1', feedback: null, exhibition: null },
      ]; // Mock data
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toEqual({
        message: '전체 자료 조회를 완료했습니다.',
        doc: result,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single exhibition doc', async () => {
      const result: ExhibitionDoc = { exhibition_doc_id: 1, file_path: 'path/to/file1', feedback: null, exhibition: null }; // Mock data
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne(1)).toEqual({
        message: '자료 조회를 완료했습니다.',
        doc: result,
      });
    });
  });

  describe('createExhibitionDoc', () => {
    it('should create and return a new exhibition doc', async () => {
      const createDto: CreateExhibitionsDocDto = {
        exhibition_id: 0
      }; // file_path가 없으므로 빈 객체로 설정
      const result: ExhibitionDoc = { exhibition_doc_id: 2, file_path: 'path/to/new_file', feedback: null, exhibition: null }; // Mock data
      jest.spyOn(service, 'createExhibitionDoc').mockResolvedValue(result);

      expect(await controller.createExhibitionDoc(createDto, null)).toEqual({
        message: '전시 문서가 성공적으로 등록되었습니다.',
        doc: result,
      });
    });
  });

  describe('update', () => {
    it('should update and return an exhibition doc', async () => {
      const updateDto: UpdateExhibitionsDocDto = { feedback: 'Great exhibition!' }; // file_path는 업데이트하지 않음
      const result: ExhibitionDoc = { exhibition_doc_id: 1, file_path: 'updated/path/to/file', feedback: 'Great exhibition!', exhibition: null }; // Mock data
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update(1, updateDto)).toEqual({
        message: '전시 문서가 성공적으로 업데이트 되었습니다.',
        doc: result,
      });
    });
  });

  describe('remove', () => {
    it('should delete an exhibition doc', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove(1)).toEqual({
        message: '성공적으로 삭제되었습니다.',
      });
    });
  });
});
