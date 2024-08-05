import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitionController } from './exhibitions.controller';
import { ExhibitionService } from './exhibitions.service';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { Exhibition } from './exhibition.entity';

describe('ExhibitionController', () => {
    let exhibitionController: ExhibitionController;
    let exhibitionService: ExhibitionService;

    const mockExhibitionService = {
        create: jest.fn(),
        findAll: jest.fn(),
        findOne: jest.fn(),
        searchExhibitions: jest.fn(),
        getExhibitionsSortedByDate: jest.fn(),
        countExhibitionsBygeneration: jest.fn(),
        remove: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExhibitionController],
            providers: [
                {
                    provide: ExhibitionService,
                    useValue: mockExhibitionService,
                },
            ],
        }).compile();

        exhibitionController = module.get<ExhibitionController>(ExhibitionController);
        exhibitionService = module.get<ExhibitionService>(ExhibitionService);
    });

    describe('create', () => {
        it('should create a new exhibition', async () => {
            const createExhibitionDto: CreateExhibitionDto = { generation: '1기', description: '힙', exhibition_title: 'hip' };
            const result: Exhibition = { exhibition_id: 1, generation: '1기', description: '힙', exhibition_title: 'hip', exhibition_date: new Date() };
            mockExhibitionService.create.mockResolvedValue(result);

            expect(await exhibitionController.create(createExhibitionDto)).toEqual({
                message: '등록이 완료되었습니다',
                exhibition: result,
            });
        });
    });

    describe('findAll', () => {
        it('should return all exhibitions', async () => {
            const result: Exhibition[] = [
                { exhibition_id: 1, generation: '1기', description: '힙', exhibition_title: 'hip', exhibition_date: new Date() },
                { exhibition_id: 2, generation: '2기', description: '아트', exhibition_title: 'art', exhibition_date: new Date() },
            ];
            mockExhibitionService.findAll.mockResolvedValue(result);

            expect(await exhibitionController.findAll()).toEqual({
                message: '모든 전시 조회를 완료했습니다.',
                exhibitions: result,
            });
        });
    });

    describe('findOne', () => {
        it('should return a specific exhibition', async () => {
            const exhibitionId = 1;
            const result: Exhibition = { exhibition_id: 1, generation: '1기', description: '힙', exhibition_title: 'hip', exhibition_date: new Date() };
            mockExhibitionService.findOne.mockResolvedValue(result);

            expect(await exhibitionController.findOne(exhibitionId)).toEqual({
                message: '전시 조회를 완료했습니다.',
                exhibition: result,
            });
        });
    });

    describe('searchExhibitions', () => {
        it('should return exhibitions based on the search criteria', async () => {
            const keyword = 'test';
            const searchIn = 'title';
            const result: Exhibition[] = [
                { exhibition_id: 1, generation: '1기', description: '힙', exhibition_title: 'test exhibition', exhibition_date: new Date() },
                { exhibition_id: 2, generation: '2기', description: '아트', exhibition_title: 'another test exhibition', exhibition_date: new Date() },
            ];
            mockExhibitionService.searchExhibitions.mockResolvedValue(result);

            expect(await exhibitionController.searchExhibitions(keyword, searchIn)).toEqual(result);
        });
    });

    describe('getExhibitionsSortedByDate', () => {
        it('should return exhibitions sorted by date', async () => {
            const result: Exhibition[] = [
                { exhibition_id: 2, generation: '2기', description: '아트', exhibition_title: 'art', exhibition_date: new Date('2023-01-01') },
                { exhibition_id: 1, generation: '1기', description: '힙', exhibition_title: 'hip', exhibition_date: new Date('2023-02-01') },
            ];
            mockExhibitionService.getExhibitionsSortedByDate.mockResolvedValue(result);

            expect(await exhibitionController.getExhibitionsSortedByDate('ASC')).toEqual(result);
        });
    });

    describe('countExhibitionsBygeneration', () => {
        it('should return the count of exhibitions by generation', async () => {
            const generation = '2023';
            const result = 10; // 2023년에 해당하는 전시 수
            mockExhibitionService.countExhibitionsBygeneration.mockResolvedValue(result);

            expect(await exhibitionController.countExhibitionsBygeneration(generation)).toEqual(result);
        });
    });

    describe('remove', () => {
        it('should delete an exhibition', async () => {
            const exhibitionId = 1;
            await exhibitionController.remove(exhibitionId);
            expect(mockExhibitionService.remove).toHaveBeenCalledWith(exhibitionId);
        });
    });
});
