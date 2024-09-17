// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersController } from './users.controller';
// import { UsersService } from './users.service';
// import { HashService } from '../auth/hash.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { User } from './user.entity';
// import { Role } from '../enums/role.enum'; // Role 가져오기

// describe('UsersController', () => {
//     let usersController: UsersController;
//     let usersService: UsersService;

//     const mockUser: User = {
//         user_id: 1,
//         user_name: 'testUser',
//         id: 'testId',
//         password: 'testPassword',
//         email: 'test@example.com',
//         generation: '2021',
//         nick_name: 'testNick',
//         user_role: Role.STUDENT, // enum 사용
//         exhibition: [],
//     };

//     const mockUsersService = {
//         create: jest.fn().mockResolvedValue(mockUser),
//         findAll: jest.fn().mockResolvedValue([mockUser]),
//         findOne: jest.fn().mockResolvedValue(mockUser),
//         remove: jest.fn().mockResolvedValue(undefined),
//         login: jest.fn().mockResolvedValue('로그인 성공'),
//         update: jest.fn().mockResolvedValue('사용자 정보가 업데이트되었습니다.'),
//     };

//     beforeEach(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             controllers: [UsersController],
//             providers: [
//                 {
//                     provide: UsersService,
//                     useValue: mockUsersService,
//                 },
//                 HashService, // HashService는 실제 인스턴스 사용
//             ],
//         }).compile();

//         usersController = module.get<UsersController>(UsersController);
//         usersService = module.get<UsersService>(UsersService);
//     });

//     it('should be defined', () => {
//         expect(usersController).toBeDefined();
//     });

//     describe('create', () => {
//         it('should create a user', async () => {
//             const createUserDto: CreateUserDto = {
//                 user_name: 'testUser',
//                 id: 'testId',
//                 password: 'testPassword',
//                 email: 'test@example.com',
//                 generation: '2021',
//                 nick_name: 'testNick',
//                 user_role: Role.STUDENT, // enum 사용
//             };

//             const result = await usersController.create(createUserDto);
//             expect(result).toEqual({ message: '회원가입이 완료되었습니다.', user: mockUser });
//             expect(usersService.create).toHaveBeenCalledWith(createUserDto);
//         });
//     });

//     describe('findAll', () => {
//         it('should return an array of users', async () => {
//             const result = await usersController.findAll();
//             expect(result).toEqual({ message: '모든 사용자 조회를 완료했습니다.', users: [mockUser] });
//             expect(usersService.findAll).toHaveBeenCalled();
//         });
//     });

//     describe('findOne', () => {
//         it('should return a user', async () => {
//             const result = await usersController.findOne(1);
//             expect(result).toEqual({ message: '사용자 조회를 완료했습니다.', user: mockUser });
//             expect(usersService.findOne).toHaveBeenCalledWith(1);
//         });
//     });

//     describe('remove', () => {
//         it('should remove a user', async () => {
//             const result = await usersController.remove(1);
//             expect(result).toEqual({ message: '사용자가 삭제되었습니다.' });
//             expect(usersService.remove).toHaveBeenCalledWith(1);
//         });
//     });

//     describe('login', () => {
//         it('should log in a user', async () => {
//             const loginDto = { id: 'testId', password: 'testPassword' };
//             const result = await usersController.login(loginDto);
//             expect(result).toEqual({ message: '로그인 성공' });
//             expect(usersService.login).toHaveBeenCalledWith(loginDto.id, loginDto.password);
//         });
//     });

//     describe('update', () => {
//         it('should update a user', async () => {
//             const updateUserDto = { email: 'new@example.com', password: 'newPassword', nick_name: 'newNick', generation: '2022' };
//             const result = await usersController.update(1, updateUserDto);
//             expect(result).toEqual({ message: '사용자 정보가 업데이트되었습니다.' });
//             expect(usersService.update).toHaveBeenCalledWith(1, updateUserDto.email, updateUserDto.password, updateUserDto.nick_name, updateUserDto.generation);
//         });

//         it('should throw an error if user not found', async () => {
//             jest.spyOn(usersService, 'findOne').mockResolvedValue(null);
//             await expect(usersController.update(1, {
//                 email: '',
//                 nick_name: '',
//                 generation: ''
//             })).rejects.toThrow('사용자를 찾을 수 없습니다.');
//         });
//     });
// });
