// import { Test, TestingModule } from '@nestjs/testing';
// import { ExhibitionsMemberController } from './exhibitions_member.controller';
// import { ExhibitionsMemberService } from './exhibitions_member.service';
// import { CreateExhibitionsMemberDto } from './dto/create-exhibitions_member.dto';
// import { ExhibitionMember } from './entities/exhibition_member.entity';

// describe('ExhibitionsMemberController', () => {
//     let controller: ExhibitionsMemberController;
//     let service: ExhibitionsMemberService;

//     const mockMember: ExhibitionMember = {
//         exhibition_member_id: 1,
//         name: '테스트 이름',
//         nick_name: '테스트 닉네임',
//         generation: '2024',
//         file_path: 'path/to/file',
//         exhibition: null, // 외래 키 관계는 필요에 따라 설정
//     };

//     const mockExhibitionsMemberService = {
//         create: jest.fn().mockResolvedValue(mockMember),
//         findAll: jest.fn().mockResolvedValue([mockMember]),
//         findOne: jest.fn().mockResolvedValue(mockMember),
//         update: jest.fn().mockResolvedValue(mockMember),
//         remove: jest.fn().mockResolvedValue(undefined),
//         downloadFile: jest.fn().mockResolvedValue({ pipe: jest.fn() }),
//     };

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             controllers: [ExhibitionsMemberController],
//             providers: [
//                 {
//                     provide: ExhibitionsMemberService,
//                     useValue: mockExhibitionsMemberService,
//                 },
//             ],
//         }).compile();

//         controller = module.get<ExhibitionsMemberController>(ExhibitionsMemberController);
//         service = module.get<ExhibitionsMemberService>(ExhibitionsMemberService);
//     });

//     it('should be defined', () => {
//         expect(controller).toBeDefined();
//     });

//     describe('create', () => {
//         it('should create a member', async () => {
//             const dto: CreateExhibitionsMemberDto = {
//                 exhibitions_id: 1,
//                 name: '테스트 이름',
//                 generation: '2024',
//             };
//             const result = await controller.create(dto, null);
//             expect(result).toEqual({ message: '멤버가 생성되었습니다.', member: mockMember });
//             expect(service.create).toHaveBeenCalledWith(dto, null);
//         });
//     });

//     describe('findAll', () => {
//         it('should return all members', async () => {
//             const result = await controller.findAll();
//             expect(result).toEqual({ message: '전체 멤버를 조회했습니다', member: [mockMember] });
//             expect(service.findAll).toHaveBeenCalled();
//         });
//     });

//     describe('findOne', () => {
//         it('should return one member', async () => {
//             const result = await controller.findOne(1);
//             expect(result).toEqual({ message: 'Id가 1인 멤버를 조회했습니다.', member: mockMember });
//             expect(service.findOne).toHaveBeenCalledWith(1);
//         });
//     });

//     describe('update', () => {
//         it('should update a member', async () => {
//             const dto: Partial<CreateExhibitionsMemberDto> = {
//                 name: '수정된 이름',
//             };
//             const result = await controller.update(1, dto);
//             expect(result).toEqual({ message: '1인 멤버를 수정했습니다', member: mockMember });
//             expect(service.update).toHaveBeenCalledWith(1, dto);
//         });
//     });

//     describe('remove', () => {
//         it('should remove a member', async () => {
//             const result = await controller.remove(1);
//             expect(result).toEqual({ message: '삭제 완료되었습니다.' });
//             expect(service.remove).toHaveBeenCalledWith(1);
//         });
//     });

//     describe('download', () => {
//         it('should download a file', async () => {
//             const res = { set: jest.fn(), pipe: jest.fn() };
//             await controller.download(1, res);
//             expect(service.downloadFile).toHaveBeenCalledWith(1);
//             expect(res.set).toHaveBeenCalledWith({
//                 'Content-Type': 'application/octet-stream',
//                 'Content-Disposition': 'attachment; filename=1.file',
//             });
//         });
//     });
// });
