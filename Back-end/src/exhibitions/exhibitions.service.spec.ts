// import { Test, TestingModule } from '@nestjs/testing';
// import { ExhibitionService } from './exhibitions.service';
// import { Exhibition } from './exhibition.entity';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CreateExhibitionDto } from './dto/create-exhibition.dto';
// import { ConflictException } from '@nestjs/common';

// describe('ExhibitionService', () => {
//     let exhibitionService: ExhibitionService;
//     let exhibitionsRepository: Repository<Exhibition>;

//     const mockExhibitionRepository = {
//         find: jest.fn(),
//         findOne: jest.fn(),
//         findOneBy: jest.fn(),
//         create: jest.fn(),
//         save: jest.fn(),
//         count: jest.fn(),
//         delete: jest.fn(),
//         createQueryBuilder: jest.fn(),
//     };

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [
//                 ExhibitionService,
//                 {
//                     provide: getRepositoryToken(Exhibition),
//                     useValue: mockExhibitionRepository,
//                 },
//             ],
//         }).compile();

//         exhibitionService = module.get<ExhibitionService>(ExhibitionService);
//         exhibitionsRepository = module.get<Repository<Exhibition>>(getRepositoryToken(Exhibition));
//     });

//     describe('create', () => {
//         it('should create a new exhibition', async () => {
//             const createExhibitionDto: CreateExhibitionDto = { generation: '1기', description: '힙', exhibition_title: 'hip' };
//             const result: Exhibition = { exhibition_id: 1, ...createExhibitionDto, exhibition_date: new Date() };

//             mockExhibitionRepository.findOne.mockResolvedValue(null); // 기존 전시가 없음을 시뮬레이션
//             mockExhibitionRepository.create.mockReturnValue(result);
//             mockExhibitionRepository.save.mockResolvedValue(result);

//             expect(await exhibitionService.create(createExhibitionDto)).toEqual(result);
//         });

//         it('should throw ConflictException if exhibition title already exists', async () => {
//             const createExhibitionDto: CreateExhibitionDto = { generation: '1기', description: '힙', exhibition_title: 'hip' };
//             const existingExhibition: Exhibition = { exhibition_id: 1, ...createExhibitionDto, exhibition_date: new Date() };

//             mockExhibitionRepository.findOne.mockResolvedValue(existingExhibition); // 기존 전시가 존재함을 시뮬레이션

//             await expect(exhibitionService.create(createExhibitionDto)).rejects.toThrow(ConflictException);
//         });
//     });

//     describe('findAll', () => {
//         it('should return an array of exhibitions', async () => {
//             const result: Exhibition[] = [{ exhibition_id: 1, generation: '1기', description: '힙', exhibition_title: 'hip', exhibition_date: new Date() }];
//             mockExhibitionRepository.find.mockResolvedValue(result);

//             expect(await exhibitionService.findAll()).toEqual(result);
//         });
//     });

//     describe('findOne', () => {
//         it('should return a specific exhibition', async () => {
//             const exhibitionId = 1;
//             const result: Exhibition = { exhibition_id: exhibitionId, generation: '1기', description: '힙', exhibition_title: 'hip', exhibition_date: new Date() };
//             mockExhibitionRepository.findOneBy.mockResolvedValue(result);

//             expect(await exhibitionService.findOne(exhibitionId)).toEqual(result);
//         });
//     });

//     describe('searchExhibitions', () => {
//         it('should return exhibitions based on title', async () => {
//             const keyword = '1기';
//             const result: Exhibition[] = [{ exhibition_id: 1, generation: '1기', description: '힙', exhibition_title: 'hip', exhibition_date: new Date() }];
//             mockExhibitionRepository.createQueryBuilder.mockReturnValue({
//                 where: jest.fn().mockReturnThis(),
//                 getMany: jest.fn().mockResolvedValue(result),
//             });

//             expect(await exhibitionService.searchExhibitions(keyword, 'title')).toEqual(result);
//         });

//         it('should return exhibitions based on description', async () => {
//             const keyword = '힙';
//             const result: Exhibition[] = [{ exhibition_id: 1, generation: '1기', description: '힙', exhibition_title: 'hip', exhibition_date: new Date() }];
//             mockExhibitionRepository.createQueryBuilder.mockReturnValue({
//                 where: jest.fn().mockReturnThis(),
//                 getMany: jest.fn().mockResolvedValue(result),
//             });

//             expect(await exhibitionService.searchExhibitions(keyword, 'description')).toEqual(result);
//         });

//         it('should return exhibitions based on both title and description', async () => {
//             const keyword = 'hip';
//             const result: Exhibition[] = [{ exhibition_id: 1, generation: '1기', description: '힙', exhibition_title: 'hip', exhibition_date: new Date() }];
//             mockExhibitionRepository.createQueryBuilder.mockReturnValue({
//                 where: jest.fn().mockReturnThis(),
//                 getMany: jest.fn().mockResolvedValue(result),
//             });

//             expect(await exhibitionService.searchExhibitions(keyword, 'both')).toEqual(result);
//         });
//     });

//     describe('getExhibitionsSortedByDate', () => {
//         it('should return exhibitions sorted by date', async () => {
//             const result: Exhibition[] = [{ exhibition_id: 1, generation: '1기', description: '힙', exhibition_title: 'hip', exhibition_date: new Date() }];
//             mockExhibitionRepository.find.mockResolvedValue(result);

//             expect(await exhibitionService.getExhibitionsSortedByDate('ASC')).toEqual(result);
//         });
//     });

//     // describe('countExhibitionsBygeneration', () => {
//     //     it('should return the count of exhibitions by generation', async () => {
//     //         const generation = '2023';
//     //         const result = 10;
//     //         mockExhibitionRepository.count.mockResolvedValue(result);

//     //         expect(await exhibitionService.countExhibitionsBygeneration(generation)).toEqual(result);
//     //     });
//     // });

//     describe('remove', () => {
//         it('should delete an exhibition', async () => {
//             const exhibitionId = 1;
//             await exhibitionService.remove(exhibitionId);
//             expect(mockExhibitionRepository.delete).toHaveBeenCalledWith(exhibitionId);
//         });
//     });
// });
