// dto/user-courses-projects.response.dto.ts
import { CourseDto } from './course.dto';
import { ProjectDto } from './project.dto';

export class UserCoursesProjectsResponseDto {
    message: string;
    courses: CourseDto[];
    projects: ProjectDto[];
}
