import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    console.log('Received token:', token);

    if (!token) {
      throw new UnauthorizedException('토큰이 필요합니다.');
    }

    const user = await this.userService.verifyToken(token);
    request.user = user; // 사용자 정보를 request에 설정

    const role = await this.userService.getUserRole(user.user_id);
    if (role === null) {
      throw new ForbiddenException('사용자를 찾을 수 없습니다.');
    }

    const roles = this.getRequiredRoles(context);
    if (!roles.includes(role)) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    return true;
  }

  private getRequiredRoles(context: ExecutionContext): string[] {
    const handler = context.getHandler();
    return Reflect.getMetadata('roles', handler) || [];
  }
}
