// import { Test, TestingModule } from '@nestjs/testing';
// import { ExhibitionsDocService } from './exhibitions_doc.service';
// import { Repository } from 'typeorm';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { ExhibitionDoc } from './entities/exhibition_doc.entity';
// import { Exhibition } from 'src/exhibitions/exhibition.entity';
// import { NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
// import { S3Client } from '@aws-sdk/client-s3';
// import { v4 as uuidv4 } from 'uuid';

// const mockExhibitionDocRepository = {
//   create: jest.fn(),
//   save: jest.fn(),
//   find: jest.fn(),
//   findOne: jest.fn(),
//   remove: jest.fn(),
// };

// const mockExhibitionRepository = {
//   findOne: jest.fn(),
// };

// const mockS3Client = {
//   send: jest.fn(),
// };

// describe('ExhibitionsDocService', () => {
//   let service: ExhibitionsDocService;
//   let exhibitionsDocRepository: Repository<ExhibitionDoc>;
//   let exhibitionRepository: Repository<Exhibition>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         ExhibitionsDocService,
//         {
//           provide: getRepositoryToken(ExhibitionDoc),
//           useValue: mockExhibitionDocRepository,
//         },
//         {
//           provide: getRepositoryToken(Exhibition),
//           useValue: mockExhibitionRepository,
//         },
//         {
//           provide: S3Client,
//           useValue: mockS3Client,
//         },
//       ],
//     }).compile();

//     service = module.get<ExhibitionsDocService>(ExhibitionsDocService);
//     exhibitionsDocRepository = module.get<Repository<ExhibitionDoc>>(getRepositoryToken(ExhibitionDoc));
//     exhibitionRepository = module.get<Repository<Exhibition>>(getRepositoryToken(Exhibition));
//   });

//   describe('createExhibitionDoc', () => {
//     it('should create and return an exhibition document', async () => {
//       const createExhibitionDocDto = { exhibition_id: 1 };
//       const file = { originalname: 'test.png', buffer: Buffer.from('test'), mimetype: 'image/png' } as Express.Multer.File;
//       const exhibition = { exhibition_id: 1 };
//       const savedDoc = { exhibition_doc_id: 1, ...createExhibitionDocDto, file_path: 'test/path' };

//       exhibitionRepository.findOne = jest.fn().mockResolvedValue(exhibition);
//       mockS3Client.send = jest.fn().mockResolvedValue({});
//       exhibitionsDocRepository.create = jest.fn().mockReturnValue(savedDoc);
//       exhibitionsDocRepository.save = jest.fn().mockResolvedValue(savedDoc);

//       const result = await service.createExhibitionDoc(createExhibitionDocDto, file);

//       expect(result).toEqual(savedDoc);
//       expect(exhibitionRepository.findOne).toHaveBeenCalledWith({ where: { exhibition_id: 1 } });
//       expect(mockS3Client.send).toHaveBeenCalled();
//       expect(exhibitionsDocRepository.save).toHaveBeenCalledWith(savedDoc);
//     });

//     it('should throw NotFoundException if exhibition is not found', async () => {
//       const createExhibitionDocDto = { exhibition_id: 1 };
//       const file = { originalname: 'test.png', buffer: Buffer.from('test'), mimetype: 'image/png' } as Express.Multer.File;

//       exhibitionRepository.findOne = jest.fn().mockResolvedValue(null);

//       await expect(service.createExhibitionDoc(createExhibitionDocDto, file)).rejects.toThrow(NotFoundException);
//     });

//     it('should throw InternalServerErrorException if S3 upload fails', async () => {
//       const createExhibitionDocDto = { exhibition_id: 1 };
//       const file = { originalname: 'test.png', buffer: Buffer.from('test'), mimetype: 'image/png' } as Express.Multer.File;
//       const exhibition = { exhibition_id: 1 };

//       exhibitionRepository.findOne = jest.fn().mockResolvedValue(exhibition);
//       mockS3Client.send = jest.fn().mockRejectedValue(new Error('S3 error'));

//       await expect(service.createExhibitionDoc(createExhibitionDocDto, file)).rejects.toThrow(InternalServerErrorException);
//     });
//   });

//   describe('findAll', () => {
//     it('should return an array of exhibition documents', async () => {
//       const result = [{ exhibition_doc_id: 1 }];
//       exhibitionsDocRepository.find = jest.fn().mockResolvedValue(result);

//       expect(await service.findAll()).toEqual(result);
//     });
//   });

//   describe('findOne', () => {
//     it('should return a single exhibition document', async () => {
//       const doc = { exhibition_doc_id: 1 };
//       exhibitionsDocRepository.findOne = jest.fn().mockResolvedValue(doc);

//       expect(await service.findOne(1)).toEqual(doc);
//     });

//     it('should throw NotFoundException if document is not found', async () => {
//       exhibitionsDocRepository.findOne = jest.fn().mockResolvedValue(null);

//       await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('update', () => {
//     it('should update and return the exhibition document', async () => {
//       const updateDto = { exhibition_id: 1 };
//       const doc = { exhibition_doc_id: 1 };
//       const exhibition = { exhibition_id: 1 };

//       exhibitionsDocRepository.findOne = jest.fn().mockResolvedValue(doc);
//       exhibitionRepository.findOne = jest.fn().mockResolvedValue(exhibition);
//       exhibitionsDocRepository.save = jest.fn().mockResolvedValue(doc);

//       const result = await service.update(1, updateDto);

//       expect(result).toEqual(doc);
//       expect(exhibitionsDocRepository.save).toHaveBeenCalledWith(doc);
//     });

//     it('should throw NotFoundException if document to update is not found', async () => {
//       exhibitionsDocRepository.findOne = jest.fn().mockResolvedValue(null);

//       await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
//     });

//     it('should throw BadRequestException if exhibition is not found during update', async () => {
//       const updateDto = { exhibition_id: 1 };
//       const doc = { exhibition_doc_id: 1 };

//       exhibitionsDocRepository.findOne = jest.fn().mockResolvedValue(doc);
//       exhibitionRepository.findOne = jest.fn().mockResolvedValue(null);

//       await expect(service.update(1, updateDto)).rejects.toThrow(BadRequestException);
//     });
//   });

//   describe('remove', () => {
//     it('should remove the exhibition document', async () => {
//       const doc = { exhibition_doc_id: 1 };
//       exhibitionsDocRepository.findOne = jest.fn().mockResolvedValue(doc);
//       exhibitionsDocRepository.remove = jest.fn();

//       await service.remove(1);

//       expect(exhibitionsDocRepository.remove).toHaveBeenCalledWith(doc);
//     });

//     it('should throw NotFoundException if document to remove is not found', async () => {
//       exhibitionsDocRepository.findOne = jest.fn().mockResolvedValue(null);

//       await expect(service.remove(1)).rejects.toThrow(NotFoundException);
//     });
//   });
// });
