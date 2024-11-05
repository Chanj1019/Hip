import { Injectable, HttpException, HttpStatus } from '@nestjs/common'; // HttpException 추가
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashService } from '../auth/hash.service';
import { ConflictException } from '@nestjs/common'; // 오류메세지 반환 http 409번
import { Registration } from '../enums/role.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>, private readonly hashService: HashService,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const { password, passwordConfirm } = createUserDto;
    
        if (password !== passwordConfirm) {
            throw new BadRequestException('비밀번호가 일치하지 않습니다.');
        }
    
        const existingUser = await this.usersRepository.findOne({
            where: [
                { email: createUserDto.email },
                { nick_name: createUserDto.nick_name },
                { id: createUserDto.id }
            ]
        });
    
        if (existingUser) {
            if (existingUser.email === createUserDto.email) {
                throw new ConflictException('이미 사용 중인 이메일입니다.');
            }
            if (existingUser.nick_name === createUserDto.nick_name) {
                throw new ConflictException('이미 사용 중인 닉네임입니다.');
            }
            if (existingUser.id === createUserDto.id) {
                throw new ConflictException('이미 사용 중인 ID입니다.');
            }
        }
    
        if (!createUserDto.password) {
            throw new BadRequestException('비밀번호가 필요합니다.');
        }
    
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.usersRepository.create({ ...createUserDto, password: hashedPassword });
        return await this.usersRepository.save(user);
    }
    
    

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findOne(userId: number): Promise<User> {
        return await this.usersRepository.findOne({ where: { user_id: userId } });
    }

    async remove(id: number): Promise<void> {
        const userId = await this.findOne(id);
        await this.usersRepository.remove(userId);
    }


    async update(userId: number, email?: string, password?: string, nick_name?: string ): Promise<string> {
        const user = await this.usersRepository.findOne({ where: { user_id: userId } });

        if (!user) {
            throw new HttpException('사용자를 찾을 수 없습니다', HttpStatus.NOT_FOUND); // 사용자 미존재 시 예외 처리
        }
    
        // 이메일 중복 검사
        if (email) {
            const existingEmailUser = await this.usersRepository.findOne({ where: { email } });
            if (existingEmailUser && existingEmailUser.user_id !== userId) {
                throw new HttpException('이메일이 이미 존재합니다', HttpStatus.CONFLICT); // 이메일 중복 시 예외 처리
            }
        }
    
        // 비밀번호가 제공된 경우에만 해싱 처리
        if (password) {
            const hashedPassword = await this.hashService.hashPassword(password);
            user.password = hashedPassword; // 해싱된 비밀번호 저장
        }
    
        // 사용자 정보 업데이트
        user.email = email;
        user.nick_name = nick_name;

        await this.usersRepository.save(user); // 업데이트된 사용자 정보 저장
    
        return 'User updated successfully'; // 성공 메시지 반환
    }

    // async findUserCourses(userId: number): Promise<CourseDto[]> {
    //     const user = await this.usersRepository
    //         .createQueryBuilder('user')
    //         .leftJoinAndSelect('user.course_registrations', 'registration') // 강의 등록과 조인
    //         .leftJoinAndSelect('registration.course', 'course') // 강의와 조인
    //         .where('user.user_id = :userId', { userId })
    //         .andWhere('registration.course_registration_status = :status', { status: Registration.APPROVED }) // 상태가 approved인 것만 가져오기
    //         .getOne(); // 단일 사용자 결과를 가져옴
    
    //     if (!user || !user.course_registrations || user.course_registrations.length === 0) {
    //         throw new HttpException('사용자의 강의를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    //     }
    
    //     // 각 강의 정보 매핑
    //     return user.course_registrations.map(registration => ({
    //         course_id: registration.course.course_id,
    //         course_title: registration.course.course_title,
    //         description: registration.course.description,
    //         instructor_name: registration.course.instructor_name,
    //         course_notice: registration.course.course_notice,
    //     }));
    // }
    
    
    
    // async findUserProjects(userId: number): Promise<ProjectDto[]> {
    //     const user = await this.usersRepository
    //         .createQueryBuilder('user')
    //         .leftJoinAndSelect('user.project_registrations', 'registration') // 프로젝트 등록과 조인
    //         .leftJoinAndSelect('registration.project', 'project') // 프로젝트와 조인
    //         .where('user.user_id = :userId', { userId })
    //         .andWhere('registration.project_registration_status = :status', { status: Registration.APPROVED }) // 상태가 approved인 것만 가져오기
    //         .getOne();
    
    //     if (!user || !user.project_registrations || user.project_registrations.length === 0) {
    //         throw new HttpException('사용자의 프로젝트를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    //     }
    
    //     // 각 프로젝트 정보 매핑
    //     return user.project_registrations.map(registration => ({
    //         project_id: registration.project.project_id,
    //         topic: registration.project.topic,
    //         class: registration.project.class,
    //         project_status: registration.project.project_status,
    //         team_name: registration.project.team_name,
    //         profile: registration.project.profile,
    //         requirements: registration.project.requirements,
    //     }));
    // }
    
    // async getUserCoursesAndProjects(userId: number): Promise<UserCoursesProjectsResponseDto> {
    //     const courses = await this.findUserCourses(userId);
    //     const projects = await this.findUserProjects(userId);

    //     return {
    //         message: '사용자의 강의와 프로젝트를 성공적으로 가져왔습니다.',
    //         courses,
    //         projects,
    //     };
    // }
    

}
    

