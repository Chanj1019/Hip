import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard'; // JWT 인증 가드 임포트

@Injectable()
export class OwnershipGuard extends JwtAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // JWT 전략에서 설정된 사용자 정보
        
        if (!user) {
            throw new UnauthorizedException('사용자가 인증되지 않았습니다.');
        }

        // 관리자 또는 강사 여부 확인
        if (user.user_role === 'admin' || user.user_role === 'instructor') {
            return true; // 모든 리소스를 삭제할 수 있음
        }

        const resourceId = request.params.id; // URL 파라미터에서 ID 가져오기
        console.log('Resource ID:', resourceId);
        if (!resourceId) {
            throw new ForbiddenException('리소스 ID가 필요합니다.');
        }

        // 소유권 확인
        if (user.user_id !== Number(resourceId)) {
            throw new ForbiddenException('자신의 계정만 삭제할 수 있습니다.');
        }

        return true; // 인증 및 소유권 확인 성공
    }
}
