// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from './users.service';

// describe('UsersService', () => {
//   let service: UsersService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [UsersService],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });
// >>>>>>>>>>>>>>>> 1.UserService와 UsersController의 의존성 해결
// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersService } from './users.service';
// import { User } from './user.entity'; // User 엔티티 임포트
// import { getRepositoryToken } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';

// describe('UsersService', () => {
//   let service: UsersService;
//   let repository: Repository<User>;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [
//         UsersService,
//         {
//           provide: getRepositoryToken(User), // UserRepository를 제공
//           useClass: Repository,
//         },
//       ],
//     }).compile();

//     service = module.get<UsersService>(UsersService);
//     repository = module.get<Repository<User>>(getRepositoryToken(User));
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });
