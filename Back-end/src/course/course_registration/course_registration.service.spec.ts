import { Test, TestingModule } from '@nestjs/testing';
import { CourseRegistrationService } from './course_registration.service';

describe('CourseRegistrationService', () => {
  let service: CourseRegistrationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseRegistrationService],
    }).compile();

    service = module.get<CourseRegistrationService>(CourseRegistrationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
