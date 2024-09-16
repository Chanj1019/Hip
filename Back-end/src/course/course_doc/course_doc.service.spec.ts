// import { Test, TestingModule } from '@nestjs/testing';
// import { CourseDocService } from './course_doc.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { CourseDoc } from './entities/course_doc.entity';
// import { DocName } from '../doc_name/entities/doc_name.entity';
// import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
// import { ConfigService } from '@nestjs/config';
// import { Repository } from 'typeorm';
// import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
// import { CreateCourseDocDto } from './dto/create-course_doc.dto';
// import { v4 as uuidv4 } from 'uuid';

// describe('CourseDocService', () => {
//   let service: CourseDocService;
//   let courseDocRepository: Repository<CourseDoc>;
//   let docNameRepository: Repository<DocName>;
//   let s3Client: S3Client;
//   let configService: ConfigService;

//   const mockCourseDocRepository = {
//     create: jest.fn(),
//     save: jest.fn(),
//     find: jest.fn(),
//     findOne: jest.fn(),
//     remove: jest.fn(),
//   };
  
//   const mockDocNameRepository = {
//     findOne: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         CourseDocService,
//         { provide: getRepositoryToken(CourseDoc), useValue: mockCourseDocRepository },
//         { provide: getRepositoryToken(DocName), useValue: mockDocNameRepository },
//         { provide: ConfigService, useValue: { get: jest.fn() } },
//       ],
//     }).compile();

//     service = module.get<CourseDocService>(CourseDocService);
//     courseDocRepository = module.get(getRepositoryToken(CourseDoc));
//     docNameRepository = module.get(getRepositoryToken(DocName));
//     configService = module.get<ConfigService>(ConfigService);
//     s3Client = service['s3'];
//   });

//   describe('uploadFile', () => {
//     it('should upload file and save file URL', async () => {
//       const mockFile = { originalname: 'file.pdf', buffer: Buffer.from('file content') } as Express.Multer.File;
//       const createCourseDocDto: CreateCourseDocDto = { course_document_description: 'Test' };
//       const mockDocName = { course_title: 'course1', topic_title: 'doc1' };
//       const bucketName = 'test-bucket';
//       const s3Url = 's3-url';

//       jest.spyOn(docNameRepository, 'findOne').mockResolvedValue(mockDocName);
//       jest.spyOn(configService, 'get').mockReturnValue(bucketName);
//       jest.spyOn(s3Client, 'send').mockResolvedValue(s3Url);
//       jest.spyOn(service, 'saveFile').mockResolvedValue(undefined);

//       const result = await service.uploadFile('course1', 'doc1', createCourseDocDto, mockFile);

//       expect(docNameRepository.findOne).toHaveBeenCalledWith({ where: { course_title: 'course1', topic_title: 'doc1' } });
//       expect(s3Client.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
//       expect(service.saveFile).toHaveBeenCalledWith(expect.any(String), createCourseDocDto, mockDocName);
//       expect(result).toBe(s3Url);
//     });

//     it('should throw error when docName is not found', async () => {
//       jest.spyOn(docNameRepository, 'findOne').mockResolvedValue(null);

//       await expect(
//         service.uploadFile('course1', 'doc1', {} as CreateCourseDocDto, {} as Express.Multer.File),
//       ).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('downloadFile', () => {
//     it('should return file stream and metadata', async () => {
//       const s3Response = {
//         Body: Buffer.from('file content'),
//         ContentType: 'application/pdf',
//         ContentLength: 1000,
//       };
//       jest.spyOn(s3Client, 'send').mockResolvedValue(s3Response);

//       const result = await service.downloadFile('file-url');

//       expect(result.stream).toBeInstanceOf(Buffer);
//       expect(result.metadata).toEqual({ ContentType: s3Response.ContentType, ContentLength: s3Response.ContentLength });
//     });

//     it('should throw InternalServerErrorException when file download fails', async () => {
//       jest.spyOn(s3Client, 'send').mockRejectedValue(new Error('error'));

//       await expect(service.downloadFile('file-url')).rejects.toThrow(InternalServerErrorException);
//     });
//   });

//   describe('remove', () => {
//     it('should remove course document successfully', async () => {
//       const mockCourseDoc = { course_document_id: 1, file_path: 'file-url' } as CourseDoc;
//       jest.spyOn(courseDocRepository, 'findOne').mockResolvedValue(mockCourseDoc);
//       jest.spyOn(courseDocRepository, 'remove').mockResolvedValue(undefined);

//       await service.remove('course1', 'doc1', 1);

//       expect(courseDocRepository.findOne).toHaveBeenCalledWith({
//         where: { course_document_id: 1, docName: { topic_title: 'doc1', course_title: 'course1' } },
//         relations: ['docName'],
//       });
//       expect(courseDocRepository.remove).toHaveBeenCalledWith(mockCourseDoc);
//     });

//     it('should throw NotFoundException when course document is not found', async () => {
//       jest.spyOn(courseDocRepository, 'findOne').mockResolvedValue(null);

//       await expect(service.remove('course1', 'doc1', 1)).rejects.toThrow(NotFoundException);
//     });
//   });
// });
