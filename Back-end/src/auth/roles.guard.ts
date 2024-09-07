import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // JWT 전략에서 설정된 사용자 정보

    if (!user) {
      throw new UnauthorizedException('사용자가 인증되지 않았습니다.');
    }

    const role = await this.userService.getUserRole(user.user_id);
    if (role === null) {
      throw new ForbiddenException('사용자를 찾을 수 없습니다.');
    }

    const roles = this.getRequiredRoles(context);
    if (!roles.length || !roles.includes(role)) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    return true;
  }

  private getRequiredRoles(context: ExecutionContext): string[] {
    const handler = context.getHandler();
    return Reflect.getMetadata('roles', handler) || [];
  }
}
