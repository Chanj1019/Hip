import { Test, TestingModule } from '@nestjs/testing';
import { CourseTextController } from './course_text.controller';
import { CourseTextService } from './course_text.service';

describe('CourseTextController', () => {
  let controller: CourseTextController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseTextController],
      providers: [CourseTextService],
    }).compile();

    controller = module.get<CourseTextController>(CourseTextController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
