import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, Req, Res, HttpStatus, UseGuards } from '@nestjs/common';//추가
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { OwnershipGuard } from '../auth/ownership.guard';
import { CourseDto } from './dto/user-courses-projects.response.dto/course.dto';
import { ProjectDto } from './dto/user-courses-projects.response.dto/project.dto';

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

    @Get(':id')
    async findOne(@Param('id') userId: number): Promise<{ message: string; user: User }> {
        const user = await this.usersService.findOne(userId);
        return { message: '사용자 조회를 완료했습니다.', user };
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard,OwnershipGuard)
    async remove(@Param('id') id: number): Promise<{ message: string }> {
        await this.usersService.remove(id);
        return { message: '사용자가 삭제되었습니다.' };
    }

    @Put(':id')
    @UseGuards(JwtAuthGuard,OwnershipGuard)
    async update(
        @Param('userid') userId: number,
        @Body() body: { email: string; password?: string; nick_name: string;}
    ): Promise<{ message: string }> {
        const user = await this.usersService.findOne(userId);

        if (!user) {
            throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND); // 사용자 미존재 시 예외 처리
        }

        const result = await this.usersService.update(userId, body.email, body.password, body.nick_name); // 업데이트 서비스 호출

        return { message: result }; // 성공 메시지 반환
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard,OwnershipGuard)
    async logout(@Req() request: Request, @Res() response: Response) {
      // JWT 토큰을 담고 있는 쿠키를 삭제
      response.clearCookie('token'); // 'token'은 쿠키의 이름입니다.
      
      // 로그아웃 성공 메시지 반환
      return response.json({ message: '로그아웃 성공' });
    }

    //유저의 강의 조회
    @Get(':id/courses')
    async findUserCourses(@Param('id') userId: number): Promise<{ message: string; courses: CourseDto[] }> {
        const courses = await this.usersService.findUserCourses(userId);
        return { message: '유저의 강의 조회를 완료했습니다.', courses };
    }

    // 유저의 프로젝트 조회
    @Get(':id/projects')
    async findUserProjects(@Param('id') userId: number): Promise<{ message: string; projects: ProjectDto[] }> {
        const projects = await this.usersService.findUserProjects(userId);
        return { message: '유저의 프로젝트 조회를 완료했습니다.', projects };
    }
}

