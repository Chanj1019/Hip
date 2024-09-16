// import { Test, TestingModule } from '@nestjs/testing';
// import { ExhibitionsDocService } from './exhibitions_doc.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { ExhibitionDoc } from './entities/exhibition_doc.entity';
// import { Exhibition } from '../exhibitions/exhibition.entity';
// import { Repository } from 'typeorm';
// import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';

// describe('ExhibitionsDocService', () => {
//   let service: ExhibitionsDocService;
//   let exhibitionsDocRepository: Repository<ExhibitionDoc>;
//   let exhibitionRepository: Repository<Exhibition>;

//   const mockExhibitionDoc = {
//     exhibition_doc_id: 1,
//     exhibition: {},
//     file_path: 'mock/path/to/file',
//     feedback: 'Great exhibition!',
//   };

//   const mockExhibition = {
//     exhibition_id: 1,
//     exhibitionDocs: [],
//   };

//   const mockExhibitionsDocRepository = {
//     create: jest.fn().mockReturnValue(mockExhibitionDoc),
//     save: jest.fn().mockResolvedValue(mockExhibitionDoc),
//     find: jest.fn().mockResolvedValue([mockExhibitionDoc]),
//     findOne: jest.fn().mockResolvedValue(mockExhibitionDoc),
//     remove: jest.fn().mockResolvedValue(undefined),
//   };

//   const mockExhibitionRepository = {
//     findOne: jest.fn().mockResolvedValue(mockExhibition),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         ExhibitionsDocService,
//         {
//           provide: getRepositoryToken(ExhibitionDoc),
//           useValue: mockExhibitionsDocRepository,
//         },
//         {
//           provide: getRepositoryToken(Exhibition),
//           useValue: mockExhibitionRepository,
//         },
//       ],
//     }).compile();

//     service = module.get<ExhibitionsDocService>(ExhibitionsDocService);
//     exhibitionsDocRepository = module.get<Repository<ExhibitionDoc>>(getRepositoryToken(ExhibitionDoc));
//     exhibitionRepository = module.get<Repository<Exhibition>>(getRepositoryToken(Exhibition));
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('createExhibitionDoc', () => {
//     it('should create and return a new exhibition document', async () => {
//       const dto = { exhibition_id: 1, feedback: 'Great exhibition!' };
//       const file = { originalname: 'test.jpg', buffer: Buffer.from('test'), mimetype: 'image/jpeg' } as Express.Multer.File;

//       const result = await service.createExhibitionDoc(dto, file);
//       expect(result).toEqual(mockExhibitionDoc);
//       expect(exhibitionsDocRepository.create).toHaveBeenCalledWith({ ...dto, exhibition: mockExhibition, file_path: expect.any(String) });
//       expect(exhibitionsDocRepository.save).toHaveBeenCalledWith(mockExhibitionDoc);
//     });

//     it('should throw NotFoundException if exhibition does not exist', async () => {
//       const dto = { exhibition_id: 999, feedback: 'Feedback' };
//       const file = { originalname: 'test.jpg', buffer: Buffer.from('test'), mimetype: 'image/jpeg' } as Express.Multer.File;

//       exhibitionRepository.findOne = jest.fn().mockResolvedValue(null);

//       await expect(service.createExhibitionDoc(dto, file)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('findAll', () => {
//     it('should return an array of exhibition documents', async () => {
//       const result = await service.findAll();
//       expect(result).toEqual([mockExhibitionDoc]);
//       expect(exhibitionsDocRepository.find).toHaveBeenCalled();
//     });
//   });

//   describe('findOne', () => {
//     it('should return an exhibition document', async () => {
//       const result = await service.findOne(1);
//       expect(result).toEqual(mockExhibitionDoc);
//       expect(exhibitionsDocRepository.findOne).toHaveBeenCalledWith({
//         where: { exhibition_doc_id: 1 },
//         relations: ['exhibition'],
//       });
//     });

//     it('should throw NotFoundException if document does not exist', async () => {
//       exhibitionsDocRepository.findOne = jest.fn().mockResolvedValue(null);
//       await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('update', () => {
//     it('should update and return the exhibition document', async () => {
//       const updateDto = { feedback: 'Updated feedback' };
      
//       // findOne을 mock하여 mockExhibitionDoc을 반환하도록 설정
//       exhibitionsDocRepository.findOne = jest.fn().mockResolvedValue(mockExhibitionDoc);
  
//       const result = await service.update(1, updateDto);
//       expect(result).toEqual({ ...mockExhibitionDoc, ...updateDto });
//       expect(exhibitionsDocRepository.save).toHaveBeenCalledWith({ ...mockExhibitionDoc, ...updateDto });
//     });
  
//     it('should throw NotFoundException if document does not exist', async () => {
//       exhibitionsDocRepository.findOne = jest.fn().mockResolvedValue(null);
//       await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
//     });
//     it('should throw BadRequestException if ID is invalid', async () => {
//         await expect(service.update(-1, {})).rejects.toThrow(BadRequestException);
//       });
      
//   });
  

//   describe('remove', () => {
//     const mockExhibitionDoc = { exhibition_doc_id: 1 }; // 존재하는 문서의 mock 데이터
  
//     beforeEach(() => {
//       // 각 테스트 전에 mock 초기화
//       jest.clearAllMocks();
//       exhibitionsDocRepository.findOne = jest.fn().mockResolvedValue(mockExhibitionDoc);
//     });
  
//     it('should remove an exhibition document', async () => {
//       await service.remove(1);
//       expect(exhibitionsDocRepository.remove).toHaveBeenCalledWith(mockExhibitionDoc);
//     });
  
//     it('should throw NotFoundException if document does not exist', async () => {
//       exhibitionsDocRepository.findOne = jest.fn().mockResolvedValue(null);
//       await expect(service.remove(999)).rejects.toThrow(NotFoundException);
//     });
//   });
// });
