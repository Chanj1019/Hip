// auth.service.ts (수정된 부분)
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    // async login(id: string, password: string): Promise<string> {
    //     const user = await this.userRepository.findOne({ where: { id } });
    //     console.log('User found:', user);

    //     if (!user) {
    //         throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    //     }

    //     const isPasswordValid = await bcrypt.compare(password, user.password);
    //     if (!isPasswordValid) {
    //         throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    //     }

    //     if (!process.env.JWT_SECRET) {
    //         throw new Error('JWT_SECRET is not defined');
    //     }

    //     const token = this.jwtService.sign({ id: user.user_id });
    //     return token;
    // }
    async login(id: string, password: string) {
        
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        
        //id값에따른 비밀번호찾기
        const user = await this.userRepository.findOne({ where: { id } });
        console.log(user);
        console.log(id);
        
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
        }
    
        const token = this.jwtService.sign({ id: user.user_id, role: user.user_role, name: user.user_name }); // 여기에 id, role 등 추가해서 보내줘야 함.
        return token;
    }
    
}
