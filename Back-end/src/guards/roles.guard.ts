import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.id; // JWT나 세션에서 사용자 ID를 가져옵니다.
    
    const role = await this.userService.getUserRole(userId);

    if (role !== 'admin') {
      throw new ForbiddenException('접근 권한이 없습니다.');
    }

    return true;
  }
}
