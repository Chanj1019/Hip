import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body: { id: string; password: string }): Promise<{ message: string; token: string }> {
        const token = await this.authService.login(body.id, body.password);
        return { message: token, token }; // 로그인 성공 시 메시지 또는 토큰 반환
    }
}