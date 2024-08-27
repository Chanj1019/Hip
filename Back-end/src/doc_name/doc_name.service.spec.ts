// import { Test, TestingModule } from '@nestjs/testing';
// import { DocNameService } from './doc_name.service';
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { DocName } from './entities/doc_name.entity';
// import { Repository } from 'typeorm';
// import { NotFoundException } from '@nestjs/common';
// import { CreateDocNameDto } from './dto/create-doc_name.dto';
// import { UpdateDocNameDto } from './dto/update-doc_name.dto';

// describe('DocNameService', () => {
//   let service: DocNameService;
//   let repository: Repository<DocName>;

//   const mockDocNameRepository = {
//     create: jest.fn(),
//     save: jest.fn(),
//     find: jest.fn(),
//     update: jest.fn(),
//     remove: jest.fn(),
//     findOne: jest.fn(),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         DocNameService,
//         {
//           provide: getRepositoryToken(DocName),
//           useValue: mockDocNameRepository,
//         },
//       ],
//     }).compile();

//     service = module.get<DocNameService>(DocNameService);
//     repository = module.get<Repository<DocName>>(getRepositoryToken(DocName));
//   });

//   describe('create', () => {
//     it('should create and return a doc name', async () => {
//       const createDocNameDto: CreateDocNameDto = {
//         topic_title: 'Sample Topic',
//         pa_topic_title: null,
//         file_path: 'path/to/file',
//       };
//       const courseTitle = 'Sample Course';
//       const createdDocName = { topic_id: 1, course_title: courseTitle, ...createDocNameDto };

//       jest.spyOn(mockDocNameRepository, 'create').mockReturnValue(createdDocName);
//       jest.spyOn(mockDocNameRepository, 'save').mockResolvedValue(createdDocName);

//       const result = await service.create(courseTitle, createDocNameDto);
//       expect(result).toEqual(createdDocName);
//       expect(mockDocNameRepository.create).toHaveBeenCalledWith({ course_title: courseTitle, ...createDocNameDto });
//       expect(mockDocNameRepository.save).toHaveBeenCalledWith(createdDocName);
//     });
//   });

//   describe('findAll', () => {
//     it('should return an array of doc names', async () => {
//       const courseTitle = 'Sample Course';
//       const resultArray = [
//         { topic_id: 1, course_title: courseTitle, topic_title: 'Topic 1' },
//         { topic_id: 2, course_title: courseTitle, topic_title: 'Topic 2' },
//       ];

//       jest.spyOn(mockDocNameRepository, 'find').mockResolvedValue(resultArray);

//       const result = await service.findAll(courseTitle);
//       expect(result).toEqual(resultArray);
//       expect(mockDocNameRepository.find).toHaveBeenCalledWith({ where: { course_title: courseTitle }, relations: ['courseDoc'] });
//     });
//   });

//   describe('update', () => {
//     it('should update and return a doc name', async () => {
//       const courseTitle = 'Sample Course';
//       const id = 1;
//       const updateDocNameDto: UpdateDocNameDto = {
//         topic_title: 'Updated Topic',
//         pa_topic_title: 2,
//         file_path: 'updated/path/to/file',
//       };
//       const updatedDocName = { topic_id: id, course_title: courseTitle, ...updateDocNameDto };

//       jest.spyOn(mockDocNameRepository, 'update').mockResolvedValue(undefined);
//       jest.spyOn(mockDocNameRepository, 'findOne').mockResolvedValue(updatedDocName);

//       const result = await service.update(courseTitle, id, updateDocNameDto);
//       expect(result).toEqual(updatedDocName);
//       expect(mockDocNameRepository.update).toHaveBeenCalledWith(id, updateDocNameDto);
//     });
//   });

//   describe('remove', () => {
//     it('should remove a doc name', async () => {
//       const id = 1;
//       const docName = { topic_id: id };

//       jest.spyOn(mockDocNameRepository, 'findOne').mockResolvedValue(docName);
//       jest.spyOn(mockDocNameRepository, 'remove').mockResolvedValue(undefined);

//       await service.remove(id);
//       expect(mockDocNameRepository.remove).toHaveBeenCalledWith(docName);
//     });

//     it('should throw a NotFoundException if doc name not found', async () => {
//       const id = 1;

//       jest.spyOn(mockDocNameRepository, 'findOne').mockResolvedValue(null);

//       await expect(service.remove(id)).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('findOne', () => {
//     it('should return a doc name', async () => {
//       const id = 1;
//       const docName = { topic_id: id, course_title: 'Sample Course', topic_title: 'Sample Topic' };

//       jest.spyOn(mockDocNameRepository, 'findOne').mockResolvedValue(docName);

//       const result = await service.findOne(id);
//       expect(result).toEqual(docName);
//     });

//     it('should throw a NotFoundException if doc name not found', async () => {
//       const id = 1;

//       jest.spyOn(mockDocNameRepository, 'findOne').mockResolvedValue(null);

//       await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
//     });
//   });
// });
