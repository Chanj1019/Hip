// jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity'; // User 엔티티 경로

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>, // User Repository 주입
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET, // 비밀 키 설정
        });
    }

    async validate(payload: any): Promise<User> {
        const user = await this.userRepository.findOne({ where: { user_id: payload.id } }); // user_id에 맞게 수정
        if (!user) {
            throw new UnauthorizedException(); // 사용자 미존재 에러
        }
        return user; // 사용자 정보를 반환
    }
}
