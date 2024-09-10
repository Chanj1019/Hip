import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  const mockUser = { user_id: 1, id: 'testUser', password: 'hashedPassword' };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mockToken'),
  };

  beforeEach(async () => {
    process.env.JWT_SECRET = 'testSecret'; // JWT_SECRET 설정

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('login', () => {
    it('should return a token on successful login', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true); // 비밀번호 검증을 통과하도록 mock 설정
      mockUserRepository.findOne.mockResolvedValue(mockUser); // 사용자 조회 시 mockUser 반환

      const result = await authService.login('testUser', 'plainPassword');

      expect(result).toBe('mockToken');
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { id: 'testUser' } });
      expect(bcrypt.compare).toHaveBeenCalledWith('plainPassword', mockUser.password);
      expect(mockJwtService.sign).toHaveBeenCalledWith({ id: mockUser.user_id });
    });

    it('should throw an exception if user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null); // 사용자 조회 시 null 반환

      await expect(authService.login('unknownUser', 'password')).rejects.toThrow(HttpException);
      await expect(authService.login('unknownUser', 'password')).rejects.toThrow('User not found');
    });

    it('should throw an exception if password is invalid', async () => {
      mockUserRepository.findOne.mockResolvedValue(mockUser); // 사용자 조회 시 mockUser 반환
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); // 비밀번호 검증 실패하도록 mock 설정

      await expect(authService.login('testUser', 'wrongPassword')).rejects.toThrow(HttpException);
      await expect(authService.login('testUser', 'wrongPassword')).rejects.toThrow('Invalid password');
    });

    it('should throw an exception if JWT_SECRET is not defined', async () => {
      delete process.env.JWT_SECRET; // JWT_SECRET을 삭제하여 undefined 상태로 만들기
  
      await expect(authService.login('testUser', 'plainPassword')).rejects.toThrow('JWT_SECRET is not defined');
  });
  
  });
});
