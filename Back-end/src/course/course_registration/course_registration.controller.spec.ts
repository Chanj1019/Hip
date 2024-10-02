import { Test, TestingModule } from '@nestjs/testing';
import { CourseRegistrationController } from './course_registration.controller';
import { CourseRegistrationService } from './course_registration.service';

describe('CourseRegistrationController', () => {
  let controller: CourseRegistrationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CourseRegistrationController],
      providers: [CourseRegistrationService],
    }).compile();

    controller = module.get<CourseRegistrationController>(CourseRegistrationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
