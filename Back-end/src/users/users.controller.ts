// import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
// import { UsersService } from './users.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { User } from './user.entity';

// @Controller('users')
// export class UsersController {
//     constructor(private readonly usersService: UsersService) {}

//     @Post('register')
//     async create(@Body() createUserDto: CreateUserDto): Promise<User> {
//         return this.usersService.create(createUserDto);
        
//     }

//     @Get()
//     async findAll(): Promise<User[]> {
//         return this.usersService.findAll();
//     }

//     @Get(':userid')
//     async findOne(@Param('userid') userId: number): Promise<User> {
//         return this.usersService.findOne(userId);
//     }

//     @Delete(':userid')
//     async remove(@Param('userid') userId: number): Promise<void> {
//         return this.usersService.remove(userId);
        
//     }

//     @Post('login')
//     async login(@Body() body: { user_name: string; password: string }): Promise<string> {
//         return this.usersService.login(body.user_name, body.password);
//     }
// }
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>응답 메세지 추가 
import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';//추가
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.entity';
import { HashService } from '../hash/hash.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService,
        private readonly hashService: HashService
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
    async remove(@Param('userid') userId: number): Promise<{ message: string }> {
        await this.usersService.remove(userId);
        return { message: '사용자가 삭제되었습니다.' };
    }

    @Put(':userid')
    async update(
        @Param('userid') userId: number,
        @Body() body: { email: string; password?: string; nick_name: string; generation:string; }
    ): Promise<{ message: string }> {
        const user = await this.usersService.findOne(userId);

        if (!user) {
            throw new HttpException('사용자를 찾을 수 없습니다.', HttpStatus.NOT_FOUND); // 사용자 미존재 시 예외 처리
        }

        const result = await this.usersService.update(userId, body.email, body.password, body.nick_name,body.generation); // 업데이트 서비스 호출

        return { message: result }; // 성공 메시지 반환
    }
}

