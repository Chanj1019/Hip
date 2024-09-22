import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Ownership = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user.user_id; // 현재 사용자 ID 반환
  },
);
