import { Test, TestingModule } from '@nestjs/testing';
import { DocNameService } from './doc_name.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DocName } from './entities/doc_name.entity';
import { Repository } from 'typeorm';
import { CreateDocNameDto } from './dto/create-doc_name.dto';
import { UpdateDocNameDto } from './dto/update-doc_name.dto';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('DocNameService', () => {
  let service: DocNameService;
  let repository: Repository<DocName>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocNameService,
        {
          provide: getRepositoryToken(DocName),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DocNameService>(DocNameService);
    repository = module.get<Repository<DocName>>(getRepositoryToken(DocName));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a doc name', async () => {
      const createDocNameDto: CreateDocNameDto = { topic_title: 'Topic', pa_topic_title: 'Subtopic' };
      const result = { topic_id: 1, ...createDocNameDto };

      mockRepository.create.mockReturnValue(result);
      mockRepository.save.mockResolvedValue(result);

      expect(await service.create('Course Title', 'Topic Title', createDocNameDto)).toEqual(result);
    });
  });

  // describe('findAll', () => {
  //   it('should return an array of doc names', async () => {
  //     const result = [new DocName()];
  //     mockRepository.find.mockResolvedValue(result);

  //     expect(await service.findAll('Topic Title')).toEqual(result);
  //   });
  // });

  describe('findOne', () => {
    it('should return a single doc name', async () => {
      const result = new DocName();
      mockRepository.findOne.mockResolvedValue(result);

      expect(await service.findOne('Topic Title')).toEqual(result);
    });

    it('should throw NotFoundException if doc name not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('Invalid Title')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should successfully update a doc name', async () => {
      const updateDocNameDto: UpdateDocNameDto = { topic_title: 'Updated Topic' };
      const docName = new DocName();
      docName.topic_id = 1;

      mockRepository.findOne.mockResolvedValue(docName);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      expect(await service.update('Topic Title', updateDocNameDto)).toEqual(docName);
    });

    it('should throw NotFoundException if doc name not found', async () => {
        mockRepository.findOne.mockResolvedValue(null);
    
        await expect(service.update('Invalid Title', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a doc name', async () => {
      const docName = new DocName();
      mockRepository.findOne.mockResolvedValue(docName);
      mockRepository.remove.mockResolvedValue({});

      await service.remove('Topic Title');
      expect(mockRepository.remove).toHaveBeenCalledWith(docName);
    });
  });
});
