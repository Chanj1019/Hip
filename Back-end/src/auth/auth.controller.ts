import { Controller, Post, Body, Get, Query, Res, UseGuards, Req, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { ApiResponse } from 'src/common/api-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);
    
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() body: { id: string; password: string }): Promise<{ message: string; token: string }> {
        const token = await this.authService.login(body.id, body.password);
        return { message: token, token }; // 로그인 성공 시 메시지 또는 토큰 반환
    }


    @Get('kakao')
    requestKakaoLogin(@Res() res: Response) {
        const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_REST_API_KEY}&redirect_uri=${encodeURIComponent(process.env.KAKAO_REDIRECT_URI)}&response_type=code`;
        res.json({ redirectUrl: kakaoLoginUrl }); // 클라이언트에 리다이렉트 URL 반환
    }

    // @Get('kakao')
    // @UseGuards(AuthGuard('kakao'))
    // async kakaoLogin(@Req() req: Request) {
    //   // 이 부분은 Passport의 AuthGuard에 의해 카카오 로그인 페이지로 리다이렉트
    // }

    // // 카카오 로그인 콜백 엔드포인트
    // @Get('kakao/callback')
    // async kakaoCallback(@Query('code') kakaoAuthResCode: string, @Res() res: Response) {  // Authorization Code 받기
    //     console.log("kakaoAuthResCode L"+ kakaoAuthResCode)
    //     const { jwtToken, user } = await this.authService.signInWithKakao(kakaoAuthResCode);
    
    //     // 쿠키에 JWT 설정
    //     res.cookie('Authorization', jwtToken, {
    //         httpOnly: true, // 클라이언트 측 스크립트에서 쿠키 접근 금지
    //         secure: false, // HTTPS에서만 쿠키 전송, 임시 비활성화
    //         maxAge: 3600000, // 1시간
    //         // sameSite: 'none', // CSRF 공격 방어
    //     });
    //     const userResponseDto = new UserResponseDto(user);

    //     this.logger.verbose(`User signed in successfully: ${JSON.stringify(userResponseDto)}`);
    //     res.status(200).json(new ApiResponse(true, 200, 'Sign in successful', { jwtToken, user: userResponseDto }));
    // }
    @Get('kakao/callback')
    async kakaoCallback(@Query('code') kakaoAuthResCode: string, @Res() res: Response) {
        try {
            const { jwtToken, user } = await this.authService.signInWithKakao(kakaoAuthResCode);
            // 클라이언트로 리다이렉트 및 JWT를 쿼리 파라미터로 전달
            const redirectUrl = `${process.env.FRONTEND_URL}/auth/kakao/callback?success=true&jwtToken=${jwtToken}`;
            res.redirect(redirectUrl);
        } catch (error) {
            console.error('Error during Kakao login processing:', error);
            res.status(500).json(new ApiResponse(false, 500, 'Kakao login failed', error));
        }
    }
    

}