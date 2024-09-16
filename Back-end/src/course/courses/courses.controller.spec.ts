// import { Test, TestingModule } from '@nestjs/testing';
// import { CoursesController } from './courses.controller';
// import { CoursesService } from './courses.service';
// import { CreateCourseDto } from './dto/create-course.dto';
// import { UpdateCourseDto } from './dto/update-course.dto';
// import { Course } from './entities/course.entity';

// describe('CoursesController', () => {
//   let controller: CoursesController;
//   let service: CoursesService;

//   const mockCourse: Course = {
//     course_id: 1,
//     course_title: 'Test Course',
//     description: 'Test Description',
//     instructor_name: 'Test Instructor',
//     course_notice: null,
//     uCats: [],
//     docName: [],
//   };

//   const mockCoursesService = {
//     create: jest.fn().mockResolvedValue(mockCourse),
//     findAll: jest.fn().mockResolvedValue([mockCourse]),
//     findOne: jest.fn().mockResolvedValue(mockCourse),
//     update: jest.fn().mockResolvedValue(mockCourse),
//     remove: jest.fn().mockResolvedValue(undefined),
//   };

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [CoursesController],
//       providers: [
//         {
//           provide: CoursesService,
//           useValue: mockCoursesService,
//         },
//       ],
//     }).compile();

//     controller = module.get<CoursesController>(CoursesController);
//     service = module.get<CoursesService>(CoursesService);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   describe('create', () => {
//     it('should create a course', async () => {
//       const createCourseDto: CreateCourseDto = {
//         course_title: 'Test Course',
//         description: 'Test Description',
//         instructor_name: 'Test Instructor',
//       };
//       expect(await controller.create(createCourseDto)).toEqual({
//         message: '생성에 성공하셨습니다',
//         data: mockCourse,
//       });
//       expect(service.create).toHaveBeenCalledWith(createCourseDto);
//     });
//   });

//   describe('findAll', () => {
//     it('should return all courses', async () => {
//       expect(await controller.findAll()).toEqual({
//         message: '전체 강의 조회에 성공하셨습니다',
//         data: [mockCourse],
//       });
//       expect(service.findAll).toHaveBeenCalled();
//     });
//   });

//   describe('findOne', () => {
//     it('should return a course', async () => {
//       const id = 'Test Course';
//       expect(await controller.findOne(id)).toEqual({
//         message: '특정 강의 조회에 성공하셨습니다',
//         data: mockCourse,
//       });
//       expect(service.findOne).toHaveBeenCalledWith(id);
//     });
//   });

//   describe('update', () => {
//     it('should update a course', async () => {
//       const id = 'Test Course';
//       const updateCourseDto: UpdateCourseDto = {
//         course_title: 'Updated Course',
//       };
//       expect(await controller.update(id, updateCourseDto)).toEqual({
//         message: '강의 수정에 성공하셨습니다',
//         data: mockCourse,
//       });
//       expect(service.update).toHaveBeenCalledWith(id, updateCourseDto);
//     });
//   });

//   describe('remove', () => {
//     it('should remove a course', async () => {
//       const id = 'Test Course';
//       expect(await controller.remove(id)).toEqual({
//         message: '강의 삭제에 성공하셨습니다',
//         data: undefined,
//       });
//       expect(service.remove).toHaveBeenCalledWith(id);
//     });
//   });
// });
