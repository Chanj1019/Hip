// import { Test, TestingModule } from '@nestjs/testing';
// import { CourseDocController } from './course_doc.controller';
// import { CourseDocService } from './course_doc.service';
// import { CreateCourseDocDto } from './dto/create-course_doc.dto';
// import { NotFoundException } from '@nestjs/common';
// import { Response } from 'express';
// import { Readable } from 'stream';

// describe('CourseDocController', () => {
//   let controller: CourseDocController;
//   let service: CourseDocService;

//   const mockCourseDocService = {
//     uploadFile: jest.fn(),
//     findAll: jest.fn(),
//     downloadFile: jest.fn(),
//     remove: jest.fn(),
//   };

//   const mockResponse = () => {
//     const res = {} as Response;
//     res.set = jest.fn().mockReturnValue(res);
//     res.pipe = jest.fn();
//     return res;
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [CourseDocController],
//       providers: [
//         {
//           provide: CourseDocService,
//           useValue: mockCourseDocService,
//         },
//       ],
//     }).compile();

//     controller = module.get<CourseDocController>(CourseDocController);
//     service = module.get<CourseDocService>(CourseDocService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   describe('create', () => {
//     it('should upload a file and return success message', async () => {
//       const dto: CreateCourseDocDto = {
//         upload_data: new Date(),
//         course_document_description: 'Test description',
//       };
//       const file = { originalname: 'test.txt', buffer: Buffer.from('test') } as Express.Multer.File;
//       const result = 'file-url';

//       mockCourseDocService.uploadFile.mockResolvedValue(result);

//       const response = await controller.create('courseTitle', 'docNameTitle', dto, file);
//       expect(mockCourseDocService.uploadFile).toHaveBeenCalledWith('courseTitle', 'docNameTitle', dto, file);
//       expect(response).toEqual({
//         message: 'File을 성공적으로 업로드 하셨습니다.',
//         data: result,
//       });
//     });
//   });

//   describe('findAll', () => {
//     it('should return all course documents', async () => {
//       const result = [{ course_document_id: 1, file_path: 'path/to/file' }];
//       mockCourseDocService.findAll.mockResolvedValue(result);

//       const response = await controller.findAll('courseTitle', 'docNameTitle');
//       expect(mockCourseDocService.findAll).toHaveBeenCalledWith('courseTitle', 'docNameTitle');
//       expect(response).toEqual({
//         message: 'Course Documents 조회에 성공하셨습니다.',
//         data: result,
//       });
//     });
//   });

//   describe('downloadFile', () => {
//     it('should download a file successfully', async () => {
//       const mockFile = { stream: new Readable(), metadata: { ContentType: 'text/plain', ContentLength: 1024 } };
//       mockCourseDocService.downloadFile.mockResolvedValue(mockFile);

//       const res = mockResponse();
//       await controller.downloadFile('test.txt', res);

//       expect(mockCourseDocService.downloadFile).toHaveBeenCalledWith('test.txt');
//       expect(res.set).toHaveBeenCalledWith({
//         'Content-Type': 'text/plain',
//         'Content-Disposition': 'attachment; filename="test.txt"',
//         'Content-Length': 1024,
//       });
//       expect(mockFile.stream.pipe).toHaveBeenCalledWith(res);
//     });

//     it('should throw a NotFoundException when file is not found', async () => {
//       mockCourseDocService.downloadFile.mockRejectedValue(new NotFoundException());

//       const res = mockResponse();
//       await expect(controller.downloadFile('nonexistent.txt', res)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('remove', () => {
//     it('should remove a course document', async () => {
//       const result = { message: 'Course Document가 성공적으로 삭제되었습니다.' };

//       mockCourseDocService.remove.mockResolvedValue(result);

//       const response = await controller.remove('courseTitle', 'docNameTitle', 1);
//       expect(mockCourseDocService.remove).toHaveBeenCalledWith('courseTitle', 'docNameTitle', 1);
//       expect(response).toEqual(result);
//     });
//   });
// });
