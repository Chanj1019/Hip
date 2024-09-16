// import { Test, TestingModule } from '@nestjs/testing';
// import { DocNameController } from './doc_name.controller';
// import { DocNameService } from './doc_name.service';
// import { CreateDocNameDto } from './dto/create-doc_name.dto';
// import { UpdateDocNameDto } from './dto/update-doc_name.dto';
// import { DocName } from './entities/doc_name.entity';

// describe('DocNameController', () => {
//     let controller: DocNameController;
//     let service: DocNameService;

//     const mockDocNameService = {
//         create: jest.fn(),
//         findAll: jest.fn(),
//         findOne: jest.fn(),
//         update: jest.fn(),
//         remove: jest.fn(),
//     };

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             controllers: [DocNameController],
//             providers: [
//                 {
//                     provide: DocNameService,
//                     useValue: mockDocNameService,
//                 },
//             ],
//         }).compile();

//         controller = module.get<DocNameController>(DocNameController);
//         service = module.get<DocNameService>(DocNameService);
//     });

//     it('should be defined', () => {
//         expect(controller).toBeDefined();
//     });

//     describe('create', () => {
//         it('should create a doc name', async () => {
//             const createDocNameDto: CreateDocNameDto = { topic_title: 'Test Title' };
//             const result = { topic_id: 1, ...createDocNameDto };
//             mockDocNameService.create.mockResolvedValue(result);

//             expect(await controller.create('courseTitle', 'topicTitle', createDocNameDto)).toEqual({
//                 message: 'doc_name 생성에 성공하셨습니다',
//                 data: result,
//             });
//         });
//     });

//     describe('findAll', () => {
//         it('should return an array of doc names', async () => {
//             const result = [{ topic_id: 1, topic_title: 'Test Title' }];
//             mockDocNameService.findAll.mockResolvedValue(result);

//             expect(await controller.findAll('topicTitle')).toEqual({
//                 message: '전체 강의의 doc_name 조회에 성공하셨습니다',
//                 data: result,
//             });
//         });
//     });

//     describe('findOne', () => {
//         it('should return a single doc name', async () => {
//             const result = { topic_id: 1, topic_title: 'Test Title' };
//             mockDocNameService.findOne.mockResolvedValue(result);

//             expect(await controller.findOne('topicTitle')).toEqual({
//                 message: '특정 강의의 doc_name 조회에 성공하셨습니다',
//                 data: result,
//             });
//         });
//     });

//     describe('update', () => {
//       it('should update a doc name', async () => {
//         const updateDocNameDto: UpdateDocNameDto = { topic_title: 'Updated Topic' };
//         const result = new DocName();
  
//         jest.spyOn(mockDocNameService, 'update').mockResolvedValue(result);
  
//         expect(await controller.update('Topic Title', updateDocNameDto)).toEqual({
//           message: 'doc_name 수정에 성공하셨습니다',
//           data: result,
//         });
//       });
//     });

//     describe('remove', () => {
//         it('should remove a doc name', async () => {
//             mockDocNameService.remove.mockResolvedValue(undefined);

//             expect(await controller.remove('topicTitle')).toEqual({
//                 message: 'doc_name 삭제에 성공하셨습니다',
//                 data: undefined,
//             });
//         });
//     });
// });
