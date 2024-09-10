// import { Test, TestingModule } from '@nestjs/testing';
// import { ExhibitionService } from './exhibitions.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Exhibition } from './exhibition.entity';
// import { Repository } from 'typeorm';
// import { ConflictException, NotFoundException } from '@nestjs/common';

// describe('ExhibitionService', () => {
//   let service: ExhibitionService;
//   let repository: Repository<Exhibition>;

//   const mockExhibitionRepository = {
//     findOne: jest.fn(),
//     create: jest.fn(),
//     save: jest.fn(),
//     find: jest.fn(),
//     delete: jest.fn(),
//     count: jest.fn(),
//   };

//   const mockExhibition = {
//     exhibition_title: 'Unique Title',
//     exhibition_date: new Date('2024-01-01T00:00:00Z'), // 고정된 날짜
//     generation: '1',
//     description: 'Test Description',
//     exhibition_id: '1',
//     team_name: 'hip',
//     file_path: null,
//   };

//   const fixedDate = new Date('2024-01-01T00:00:00Z');

//   beforeEach(async () => {
//     jest.useFakeTimers().setSystemTime(fixedDate); // 시간 고정

//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         ExhibitionService,
//         {
//           provide: getRepositoryToken(Exhibition),
//           useValue: mockExhibitionRepository,
//         },
//       ],
//     }).compile();

//     service = module.get<ExhibitionService>(ExhibitionService);
//     repository = module.get<Repository<Exhibition>>(getRepositoryToken(Exhibition));
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//     jest.useRealTimers(); // 원래 타이머로 복구
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });

//   describe('create', () => {
//     it('should successfully create a new exhibition', async () => {
//       mockExhibitionRepository.findOne.mockResolvedValue(null);
//       mockExhibitionRepository.create.mockReturnValue(mockExhibition);
//       mockExhibitionRepository.save.mockResolvedValue(mockExhibition);

//       const result = await service.create(mockExhibition, null);
//       expect(result).toEqual(mockExhibition);
//       expect(mockExhibitionRepository.create).toHaveBeenCalledWith(mockExhibition);
//       expect(mockExhibitionRepository.save).toHaveBeenCalled();
//     });

//     it('should throw ConflictException if exhibition title already exists', async () => {
//       mockExhibitionRepository.findOne.mockResolvedValue(mockExhibition);
      
//       await expect(service.create(mockExhibition, null)).rejects.toThrow(ConflictException);
//     });
//   });

//   describe('findAll', () => {
//     it('should retrieve an array of exhibitions', async () => {
//       mockExhibitionRepository.find.mockResolvedValue([mockExhibition]);

//       const result = await service.findAll();
//       expect(result).toEqual([mockExhibition]);
//     });
//   });

//   describe('findOne', () => {
//     it('should return a specific exhibition', async () => {
//       mockExhibitionRepository.findOne.mockResolvedValue(mockExhibition);

//       const result = await service.findOne(mockExhibition.exhibition_title);
//       expect(result).toEqual(mockExhibition);
//     });

//     it('should throw NotFoundException if exhibition not found', async () => {
//       mockExhibitionRepository.findOne.mockResolvedValue(null);

//       await expect(service.findOne(mockExhibition.exhibition_title)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('remove', () => {
//     it('should successfully remove an exhibition', async () => {
//       mockExhibitionRepository.delete.mockResolvedValue({ affected: 1 });

//       await service.remove(mockExhibition.exhibition_title);
//       expect(mockExhibitionRepository.delete).toHaveBeenCalledWith({ exhibition_title: mockExhibition.exhibition_title });
//     });

//     it('should throw NotFoundException if exhibition not found', async () => {
//       mockExhibitionRepository.delete.mockResolvedValue({ affected: 0 });

//       await expect(service.remove(mockExhibition.exhibition_title)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('updateExhibition', () => {
//     it('should successfully update an exhibition', async () => {
//       const updateDto = { exhibition_title: 'Updated Unique Title', description: 'Updated Description' };
//       mockExhibitionRepository.findOne.mockResolvedValue(mockExhibition);
//       mockExhibitionRepository.save.mockResolvedValue({ 
//         ...mockExhibition, 
//         ...updateDto,
//       });

//       const result = await service.updateExhibition(mockExhibition.exhibition_id, updateDto);

//       expect(result.exhibition_title).toEqual('Updated Unique Title');
//       expect(result.description).toEqual('Updated Description');
//       expect(mockExhibitionRepository.save).toHaveBeenCalled();
//     });

//     it('should throw NotFoundException if exhibition to update does not exist', async () => {
//       mockExhibitionRepository.findOne.mockResolvedValue(null);

//       await expect(service.updateExhibition(mockExhibition.exhibition_id, {})).rejects.toThrow(NotFoundException);
//     });

//     it('should throw ConflictException if exhibition title already exists', async () => {
//       mockExhibitionRepository.findOne.mockResolvedValue(mockExhibition); // 기존 전시 제목
//       mockExhibitionRepository.count.mockResolvedValue(1); // 중복 제목을 시뮬레이션
//       const updateDto = { exhibition_title: 'Unique Title' }; // 중복 제목

//       await expect(service.updateExhibition(mockExhibition.exhibition_id, updateDto)).rejects.toThrow(ConflictException);
//     });
//   });
// });
