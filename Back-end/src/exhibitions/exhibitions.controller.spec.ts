// import { Test, TestingModule } from '@nestjs/testing';
// import { ExhibitionController } from './exhibitions.controller';
// import { ExhibitionService } from './exhibitions.service';
// import { CreateExhibitionDto } from './dto/create-exhibition.dto';
// import { UpdateExhibitionDto } from './dto/update-exhibition.dto';
// import { Exhibition } from './exhibition.entity';
// import { User } from '../users/user.entity';

// describe('ExhibitionController', () => {
//     let exhibitionController: ExhibitionController;
//     let exhibitionService: ExhibitionService;

//     const mockExhibitionService = {
//         create: jest.fn(),
//         findAll: jest.fn(),
//         findOne: jest.fn(),
//         searchExhibitions: jest.fn(),
//         getExhibitionsSortedByDate: jest.fn(),
//         getExhibitionsSortedByGeneration: jest.fn(),
//         remove: jest.fn(),
//         updateExhibition: jest.fn(),
//     };

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             controllers: [ExhibitionController],
//             providers: [
//                 {
//                     provide: ExhibitionService,
//                     useValue: mockExhibitionService,
//                 },
//             ],
//         }).compile();

//         exhibitionController = module.get<ExhibitionController>(ExhibitionController);
//         exhibitionService = module.get<ExhibitionService>(ExhibitionService);
//     });

//     it('should be defined', () => {
//         expect(exhibitionController).toBeDefined();
//     });

//     describe('create', () => {
//         it('should create a new exhibition', async () => {
//             const createExhibitionDto: CreateExhibitionDto = {
//                 generation: '2024',
//                 exhibition_title: 'New Exhibition',
//                 team_name: 'Team A',
//                 description: 'This is a new exhibition.',
                
//             };
//             const result: Exhibition = {
//                 exhibition_id: 1, ...createExhibitionDto,
//                 exhibition_date: undefined,
//                 file_path: '',
//                 exhibitionDocs: [],
//                 exhibitionMembers: [],
//                 exhibitionIntros: [],
//                 user: new User
//             };

//             mockExhibitionService.create.mockResolvedValue(result);

//             expect(await exhibitionController.create(createExhibitionDto, null)).toEqual({
//                 message: '등록이 완료되었습니다',
//                 exhibition: result,
//             });
//         });
//     });

//     describe('findAll', () => {
//         it('should return all exhibitions', async () => {
//             const result: Exhibition[] = [{
//                 exhibition_id: 1, exhibition_title: 'Exhibition 1',
//                 generation: '',
//                 description: '',
//                 exhibition_date: undefined,
//                 file_path: '',
//                 team_name: '',
//                 exhibitionDocs: [],
//                 exhibitionMembers: [],
//                 exhibitionIntros: [],
//                 user: new User
//             }];

//             mockExhibitionService.findAll.mockResolvedValue(result);

//             expect(await exhibitionController.findAll()).toEqual({
//                 message: '모든 전시 조회를 완료했습니다.',
//                 exhibitions: result,
//             });
//         });
//     });

//     describe('findOne', () => {
//         it('should return a single exhibition', async () => {
//             const exhibitionTitle = 'Exhibition 1';
//             const result: Exhibition = {
//                 exhibition_id: 1, exhibition_title: exhibitionTitle,
//                 generation: '',
//                 description: '',
//                 exhibition_date: undefined,
//                 file_path: '',
//                 team_name: '',
//                 exhibitionDocs: [],
//                 exhibitionMembers: [],
//                 exhibitionIntros: [],
//                 user: new User
//             };

//             mockExhibitionService.findOne.mockResolvedValue(result);

//             expect(await exhibitionController.findOne(exhibitionTitle)).toEqual({
//                 message: '전시 조회를 완료했습니다.',
//                 exhibition: result,
//             });
//         });
//     });

//     describe('remove', () => {
//         it('should delete an exhibition', async () => {
//             const exhibitionTitle = 'Exhibition 1';

//             await exhibitionController.remove(exhibitionTitle);

//             expect(mockExhibitionService.remove).toHaveBeenCalledWith(exhibitionTitle);
//             expect(await exhibitionController.remove(exhibitionTitle)).toEqual({
//                 message: '전시가 삭제되었습니다.',
//             });
//         });
//     });

//     describe('update', () => {
//         it('should update an exhibition', async () => {
//             const exhibitionTitle = 'Exhibition 1';
//             const updateExhibitionDto: UpdateExhibitionDto = {
//                 exhibition_title: 'Updated Exhibition',
//                 description: 'Updated description',
//             };

//             mockExhibitionService.updateExhibition.mockResolvedValue(undefined);

//             expect(await exhibitionController.update(exhibitionTitle, updateExhibitionDto)).toEqual({
//                 message: '전시 정보가 성공적으로 업데이트되었습니다.',
//             });
//         });
//     });
// });
