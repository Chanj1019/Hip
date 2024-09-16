import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/users.service';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // JWT 전략에서 설정된 사용자 정보
   
    if (!user) {
      throw new UnauthorizedException('사용자가 인증되지 않았습니다.');
    }

    const role = await this.getUserRole(user.user_id);
    if (role === null) {
      throw new ForbiddenException('사용자를 찾을 수 없습니다.');
    }

    const roles = this.getRequiredRoles(context);
    if (!roles.length || !roles.includes(role)) {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    return true;
  }
     // 사용자 역할을 확인하는 메소드
    async getUserRole(userId: number): Promise<Role> {
     const user = await this.userService.findOne(userId);
     return user.user_role; // 역할 반환
  }
  
  private getRequiredRoles(context: ExecutionContext): string[] {
    const handler = context.getHandler();
    return Reflect.getMetadata('roles', handler) || [];
  }
}
