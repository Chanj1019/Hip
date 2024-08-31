import { Test, TestingModule } from '@nestjs/testing';
import { CourseTextService } from './course_text.service';

describe('CourseTextService', () => {
  let service: CourseTextService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CourseTextService],
    }).compile();

    service = module.get<CourseTextService>(CourseTextService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
