import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(), // AuthService의 login 메서드를 mock
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a message on successful login', async () => {
      const loginDto = { id: 'testUser', password: 'testPassword' };
      const result = '로그인 성공'; // AuthService에서 반환할 값

      jest.spyOn(authService, 'login').mockResolvedValue(result); // mockResolvedValue로 비동기 메서드 결과 설정

      expect(await authController.login(loginDto)).toEqual({ message: result });
      expect(authService.login).toHaveBeenCalledWith(loginDto.id, loginDto.password); // 호출 여부 확인
    });
  });
});
