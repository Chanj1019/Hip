// auth.service.ts (수정된 부분)
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity'; 
import * as bcrypt from 'bcrypt';
import { Course } from 'src/course/courses/entities/course.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
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
        const user = await this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('user.course_registrations', 'course_registrations')
            .leftJoinAndSelect('course_registrations.course', 'course')
            .where('user.id = :id', { id })
            .getOne();
        console.log(user);
        console.log(id);
        // console.log();
        
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
        }
    
        const approvedCourseIds = user.course_registrations
        ?.filter(registration => {
            console.log('Registration status:', registration.course_registration_status);
            console.log('Registration course:', registration.course);
            return registration.course_registration_status === 'approved' && registration.course;
        })
        ?.map(registration => {
            console.log('Mapping course:', registration.course);
            return registration.course.course_id; // 또는 course_id depending on your entity structure
        }) || [];

        console.log('Approved course IDs:', approvedCourseIds);
        
        const token = this.jwtService.sign({ id: user.user_id, role: user.user_role, name: user.user_name, email: user.email, courseIds: approvedCourseIds }); // 여기에 id, role 등 추가해서 보내줘야 함.
        return token;
    }
    
}
