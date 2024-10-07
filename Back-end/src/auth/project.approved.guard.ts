import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { ProjectsService } from '../project/projects/projects.service';

@Injectable()
export class ApprovedStudentGuard implements CanActivate {
  constructor(private readonly projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const loginedUserId = request.user.user_id; // 로그인된 사용자 ID
    const projectId = +request.params.id; // 프로젝트 ID

    // 사용자가 해당 프로젝트에 대해 승인된 학생인지 확인
    const isApproved = await this.projectsService.isApprovedStudent(loginedUserId, projectId);

    if (!isApproved) {
      throw new ForbiddenException('해당 프로젝트에 대한 권한이 없습니다.');
    }

    return true;
  }
}
