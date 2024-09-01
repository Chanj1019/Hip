import { Test, TestingModule } from '@nestjs/testing';
import { ExhibitionsMemberService } from './exhibitions_member.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ExhibitionMember } from './entities/exhibition_member.entity';
import { Exhibition } from '../exhibitions/exhibition.entity';
import { Repository } from 'typeorm';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ExhibitionService } from '../exhibitions/exhibitions.service';

const mockExhibitionMemberRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
    find: jest.fn(),
};

const mockExhibitionRepository = {
    findOne: jest.fn(),
};

const mockExhibitionService = {
    findOne: jest.fn(),
};

describe('ExhibitionsMemberService', () => {
    let service: ExhibitionsMemberService;
    let exhibitionMemberRepository: Repository<ExhibitionMember>;
    let exhibitionRepository: Repository<Exhibition>;
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExhibitionsMemberService,
                {
                    provide: getRepositoryToken(ExhibitionMember),
                    useValue: mockExhibitionMemberRepository,
                },
                {
                    provide: getRepositoryToken(Exhibition),
                    useValue: mockExhibitionRepository,
                },
                {
                    provide: ExhibitionService,
                    useValue: mockExhibitionService,
                },
                {
                    provide: S3Client,
                    useValue: {}, // S3Client 모의 설정
                },
            ],
        }).compile();

        service = module.get<ExhibitionsMemberService>(ExhibitionsMemberService);
        exhibitionMemberRepository = module.get<Repository<ExhibitionMember>>(getRepositoryToken(ExhibitionMember));
        exhibitionRepository = module.get<Repository<Exhibition>>(getRepositoryToken(Exhibition));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a new exhibition member', async () => {
            const createDto = { exhibitions_id: 1, name: 'Test Member' ,generation:'1기'};
            const file = { originalname: 'test.jpg', buffer: Buffer.from('test'), mimetype: 'image/jpeg' } as Express.Multer.File;

            mockExhibitionRepository.findOne.mockResolvedValueOnce({ exhibition_id: 1 });
            mockExhibitionMemberRepository.create.mockReturnValue(createDto);
            mockExhibitionMemberRepository.save.mockResolvedValue(createDto);

            const result = await service.create(createDto, file);
            expect(result).toEqual(createDto);
            expect(mockExhibitionMemberRepository.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException if exhibition is not found', async () => {
            const createDto = { exhibitions_id: 1, name: 'Test Member',generation:'1기' };
            const file = { originalname: 'test.jpg', buffer: Buffer.from('test'), mimetype: 'image/jpeg' } as Express.Multer.File;

            mockExhibitionRepository.findOne.mockResolvedValueOnce(null);

            await expect(service.create(createDto, file)).rejects.toThrow(NotFoundException);
        });
    });

    describe('findAll', () => {
        it('should return an array of exhibition members', async () => {
            const members = [{ exhibition_member_id: 1, name: 'Member 1' }];
            mockExhibitionMemberRepository.find.mockResolvedValue(members);

            const result = await service.findAll();
            expect(result).toEqual(members);
        });
    });

    describe('findOne', () => {
        it('should return an exhibition member', async () => {
            const member = { exhibition_member_id: 1, name: 'Member 1' };
            mockExhibitionMemberRepository.findOne.mockResolvedValue(member);

            const result = await service.findOne(1);
            expect(result).toEqual(member);
        });

        it('should throw NotFoundException if member is not found', async () => {
            mockExhibitionMemberRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
        });
    });

    describe('update', () => {
        it('should update an exhibition member', async () => {
            const existingMember = { exhibition_member_id: 1, name: 'Member 1' };
            const updateData = { name: 'Updated Member' };

            mockExhibitionMemberRepository.findOne.mockResolvedValue(existingMember);
            mockExhibitionMemberRepository.save.mockResolvedValue({ ...existingMember, ...updateData });

            const result = await service.update(1, updateData);
            expect(result.name).toEqual('Updated Member');
        });

        it('should throw NotFoundException if member does not exist', async () => {
            mockExhibitionMemberRepository.findOne.mockResolvedValue(null);

            await expect(service.update(1, {})).rejects.toThrow(NotFoundException);
        });
    });

    describe('remove', () => {
        it('should remove an exhibition member', async () => {
            const member = { exhibition_member_id: 1, file_path: 'path/to/file.jpg' };
            mockExhibitionMemberRepository.findOne.mockResolvedValue(member);
            mockExhibitionMemberRepository.remove.mockResolvedValue(undefined);

            await service.remove(1);
            expect(mockExhibitionMemberRepository.remove).toHaveBeenCalledWith(member);
        });

        it('should throw NotFoundException if member does not exist', async () => {
            mockExhibitionMemberRepository.findOne.mockResolvedValue(null);

            await expect(service.remove(1)).rejects.toThrow(NotFoundException);
        });
    });
});
