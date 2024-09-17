import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, Req, Res, HttpStatus } from '@nestjs/common';//추가
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { Request, Response } from 'express';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService,
    ) {}

    @Post('register')
    async create(@Body() createUserDto: CreateUserDto): Promise<{ message: string; user: User }> {
        const user = await this.usersService.create(createUserDto);
        return { message: '회원가입이 완료되었습니다.', user };
    }

    @Get()
    async findAll(): Promise<{ message: string; users: User[] }> {
        const users = await this.usersService.findAll();
        return { message: '모든 사용자 조회를 완료했습니다.', users };
    }

    @Get(':userid')
    async findOne(@Param('userid') userId: number): Promise<{ message: string; user: User }> {
        const user = await this.usersService.findOne(userId);
        return { message: '사용자 조회를 완료했습니다.', user };
    }

    @Delete(':userid')
    async remove(@Param('userid') id: number): Promise<{ message: string }> {
        await this.usersService.remove(id);
        return { message: '사용자가 삭제되었습니다.' };
    }

    @Put(':userid')
    async update(
        @Param('userid') userId: number,
        @Body() body: { email: string; password?: string; nick_name: string; generation: string; }
    ): Promise<{ message: string }> {
        const user = await this.usersService.findOne(userId);

        if (!user) {
            throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND); // 사용자 미존재 시 예외 처리
        }

        const result = await this.usersService.update(userId, body.email, body.password, body.nick_name,body.generation); // 업데이트 서비스 호출

        return { message: result }; // 성공 메시지 반환
    }

    @Post('logout')
    async logout(@Req() request: Request, @Res() response: Response) {
      // JWT 토큰을 담고 있는 쿠키를 삭제
      response.clearCookie('token'); // 'token'은 쿠키의 이름입니다.
      
      // 로그아웃 성공 메시지 반환
      return response.json({ message: '로그아웃 성공' });
    }
}

