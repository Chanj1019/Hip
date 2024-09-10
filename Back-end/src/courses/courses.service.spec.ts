import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CoursesService', () => {
  let service: CoursesService;
  let repository: Repository<Course>;

  const mockCourse: Course = {
    course_id: 2,
    course_title: 'Test Courses',
    description: 'Test Descriptions',
    instructor_name: 'Test Instructors',
    course_notice: 'Test Notices',
    uCats: [],
    docName: [],
  };

  const mockRepository = {
    create: jest.fn().mockReturnValue(mockCourse),
    save: jest.fn().mockResolvedValue(mockCourse),
    find: jest.fn().mockResolvedValue([mockCourse]),
    findOne: jest.fn().mockResolvedValue(mockCourse),
    remove: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    repository = module.get<Repository<Course>>(getRepositoryToken(Course));
  });

  describe('create', () => {
    it('should create a course', async () => {
      const dto: CreateCourseDto = {
        course_title: 'Test Course',
        description: 'Test Description',
        instructor_name: 'Test Instructor',
      };

      await expect(service.create(dto)).rejects.toThrow('강의 제목이 이미 존재합니다.');
    });
  });

  describe('findAll', () => {
    it('should return all courses', async () => {
      expect(await service.findAll()).toEqual([mockCourse]);
    });
  });

  describe('findOne', () => {
    it('should return a single course', async () => {
      expect(await service.findOne('Test Course')).toEqual(mockCourse);
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const dto: UpdateCourseDto = {
        course_title: 'Updated Course',
      };

      expect(await service.update('Test Course', dto)).toEqual(mockCourse);
    });
  });

  describe('remove', () => {
    it('should delete a course', async () => {
      expect(await service.remove('Test Course')).toBeUndefined();
    });
  });
});
