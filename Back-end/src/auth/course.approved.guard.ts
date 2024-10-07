import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { CoursesService } from '../course/courses/courses.service'; // CoursesService를 임포트합니다.

@Injectable()
export class ApprovedInstructorGuard implements CanActivate {
  constructor(private readonly coursesService: CoursesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const loginedUserId = request.user.user_id; // 로그인된 사용자 ID
    const courseId = +request.params.id; // 강의 ID

    // 사용자가 해당 강의에 대해 승인된 강사인지 확인
    const isApproved = await this.coursesService.isApprovedInstructor(loginedUserId, courseId);

    if (!isApproved) {
      throw new ForbiddenException('해당 강의에 대한 권한이 없습니다.');
    }

    return true;
  }
}
