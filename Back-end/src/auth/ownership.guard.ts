import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CoursesService } from '../course/courses/courses.service'; // 코스 서비스 임포트
import { ProjectsService } from '../project/projects/projects.service'; // 프로젝트 서비스 임포트

@Injectable()
export class OwnershipGuard extends JwtAuthGuard implements CanActivate {
    constructor(
        private readonly courseService: CoursesService,
        private readonly projectService: ProjectsService,
    ) {
        super();
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new UnauthorizedException('사용자가 인증되지 않았습니다.');
        }

        // 관리자 여부 확인
        if (user.user_role === 'admin') {
            return true;
        }

        const resourceType = request.params.type; // 리소스 유형 가져오기
        const resourceId = request.params.id; // 리소스 ID 가져오기

        if (!resourceType || !resourceId) {
            throw new ForbiddenException('리소스 종류와 ID가 필요합니다.');
        }

        let resourceOwnerId: number | null = null;
        if (resourceType === 'course') {
            const course = await this.courseService.findOne(resourceId);
            if (!course) {
                throw new ForbiddenException('존재하지 않는 코스입니다.');
            }
        
            // UCat 배열에서 요청한 사용자 ID와 일치하는 강사 찾기
            const owner = course.user.find(user => user.user_id === user.user_id);
            if (!owner) {
                throw new ForbiddenException('자신의 리소스만 수정할 수 있습니다.');
            }
        
            resourceOwnerId = owner.user_id; // 소유자의 ID 저장
        }
        
        else if (resourceType === 'project') {
            const project = await this.projectService.findOne(resourceId);
            if (!project) {
                throw new ForbiddenException('존재하지 않는 프로젝트입니다.');
            }
            // 프로젝트와 관련된 사용자 중 요청한 사용자 ID와 일치하는 사용자 찾기
            const owner = project.users.find(user => user.user_id === user.user_id);
            if (!owner) {
                throw new ForbiddenException('자신의 리소스만 수정할 수 있습니다.');
            }
            resourceOwnerId = owner.user_id; // 소유자의 ID 저장
        } else {
            throw new ForbiddenException('지원하지 않는 리소스 유형입니다.');
        }

        // 소유권 확인
        if (resourceOwnerId !== user.user_id) {
            throw new ForbiddenException('자신의 리소스만 삭제할 수 있습니다.');
        }

        return true;
    }
}
