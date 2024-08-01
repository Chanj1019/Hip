import { Injectable, HttpException, HttpStatus } from '@nestjs/common'; // HttpException 추가
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { HashService } from '../hash/hash.service';
@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>, private readonly hashService: HashService
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = this.usersRepository.create({ ...createUserDto, password: hashedPassword });
        return await this.usersRepository.save(user);
    }

    async findAll(): Promise<User[]> {
        return await this.usersRepository.find();
    }

    async findOne(userId: number): Promise<User> {
        return await this.usersRepository.findOneBy({ user_id: userId });
        
    }

    async remove(userId: number): Promise<void> {
        await this.usersRepository.delete(userId);
    }

    // async login(user_name: string, password: string): Promise<string> {
    //     const user = await this.usersRepository.findOneBy({ user_name });
    //     if (!user || !(await bcrypt.compare(password, user.password))) {
    //         throw new Error('Invalid credentials');
    //     }
    //     const token = jwt.sign({ id: user.user_id }, 'your_secret_key', { expiresIn: '1h' });
    //     return token;
    // } >>> 응답개선


    async login(user_name: string, password: string): Promise<string> {
        const user = await this.usersRepository.findOneBy({ user_name });
        // 예외 처리 개선: 잘못된 자격 증명에 대해 명확한 HTTP 응답 코드 반환
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }
        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // 환경 변수 사용
        return token;
    }

    async update(userId: number, email: string, password: string, nick_name: string): Promise<string> {
        const user = await this.usersRepository.findOneBy({ user_id: userId });
        
        if (!user) {
            throw new HttpException('사용자를 찾을 수 없습니다', HttpStatus.NOT_FOUND); // 사용자 미존재 시 예외 처리
        }

        // 이메일 중복 검사
        const existingEmailUser = await this.usersRepository.findOneBy({ email });
        if (existingEmailUser && existingEmailUser.user_id !== userId) {
            throw new HttpException('이메일이 이미 존재합니다', HttpStatus.CONFLICT); // 이메일 중복 시 예외 처리
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
}
    

