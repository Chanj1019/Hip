// auth.service.ts (수정된 부분)
import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity'; 
import * as bcrypt from 'bcrypt';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private httpService: HttpService
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
    
        const token = this.jwtService.sign({ id: user.user_id, role: user.user_role, name: user.user_name, email: user.email }); // 여기에 id, role 등 추가해서 보내줘야 함.
        return token;
    }

    async signUpWithKakao(kakaoId: string, profile: any): Promise<User> {
        const kakaoAccount = profile.kakao_account;
        
        if (!kakaoAccount) {
            this.logger.error('Kakao account information is missing');
            throw new Error('Kakao account information is missing');
        }
    
        // 프로필 정보에서 nickname과 email 가져오기
        const kakaoUsername = kakaoAccount.name;
        const kakaoUsernickname = kakaoAccount.profile.nickname; // nickname 사용
        const kakaoEmail = kakaoAccount.email;
        const userId =  uuidv4();
    
        // 카카오 프로필 데이터를 기반으로 사용자 찾기 또는 생성 로직을 구현
        const existingUser = await this.userRepository.findOne({ where: { email: kakaoEmail } });
        if (existingUser) {
            return existingUser;
        }

        // 비밀번호 필드에 랜덤 문자열 생성
        
        const temporaryPassword = uuidv4(); // 랜덤 문자열 생성
        const hashedPassword = await this.hashPassword(temporaryPassword);
        
        // 새 사용자 생성 로직
        const newUser = this.userRepository.create({
            id: userId,
            user_name: kakaoUsername,
            nick_name: kakaoUsernickname,
            email: kakaoEmail,
            password: hashedPassword, // 해싱된 임시 비밀번호 사용

            // 기타 필요한 필드 설정
        });
        return this.userRepository.save(newUser);
    }

    
    

   // 카카오 로그인
async signInWithKakao(kakaoAuthResCode: string): Promise<{ jwtToken: string, user: User }> {
    // Authorization Code로 Kakao API에 Access Token 요청
    const accessToken = await this.getKakaoAccessToken(kakaoAuthResCode);

    // Access Token으로 Kakao 사용자 정보 요청
    const kakaoUserInfo = await this.getKakaoUserInfo(accessToken);

    // 카카오 사용자 정보를 기반으로 회원가입 또는 로그인 처리
    const user = await this.signUpWithKakao(kakaoUserInfo.id.toString(), kakaoUserInfo);

    // [1] JWT 토큰 생성 (Secret + Payload)
    const jwtToken = await this.generateJwtToken(user);

    // [2] JWT를 클라이언트에 반환
    return { jwtToken, user }; // 클라이언트에서 사용할 수 있도록 반환
}


    // Kakao Authorization Code로 Access Token 요청
    async getKakaoAccessToken(code: string): Promise<string> {
        const tokenUrl = 'https://kauth.kakao.com/oauth/token';
        const payload = {
            grant_type: 'authorization_code',
            client_id: process.env.KAKAO_REST_API_KEY, // Kakao REST API Key
            redirect_uri: process.env.KAKAO_REDIRECT_URI,
            code,
            // client_secret: process.env.KAKAO_CLIENT_SECRET // 필요시 사용
        };
    
        const response = await firstValueFrom(this.httpService.post(tokenUrl, null, {
            params: payload,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }));
    
        return response.data.access_token;  // Access Token 반환
    }

    // Access Token으로 Kakao 사용자 정보 요청
    async getKakaoUserInfo(accessToken: string): Promise<any> {
        const userInfoUrl = 'https://kapi.kakao.com/v2/user/me';
        const response = await firstValueFrom(this.httpService.get(userInfoUrl, {
            headers: { Authorization: `Bearer ${accessToken}` }
        }));
        this.logger.debug(`Kakao User Info: ${JSON.stringify(response.data)}`); // 데이터 확인
        return response.data;
    }
    
     // JWT 생성 공통 메서드
     async generateJwtToken(user: User): Promise<string> {
        // [1] JWT 토큰 생성 (Secret + Payload)
        const payload = { 
            email: user.email,
            userId: user.id,
            role: user.user_role
            };
        const accessToken = await this.jwtService.sign(payload);
        this.logger.debug(`Generated JWT Token: ${accessToken}`);
        this.logger.debug(`User details: ${JSON.stringify(user)}`);
        return accessToken;
    }

    private async hashPassword(password: string): Promise<string> {
        this.logger.verbose(`Hashing password`);

        const salt = await bcrypt.genSalt(); // 솔트 생성
        return await bcrypt.hash(password, salt); // 비밀번호 해싱
    }

}

