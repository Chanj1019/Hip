// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersController } from './users.controller';

// describe('UsersController', () => {
//   let controller: UsersController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//     }).compile();

//     controller = module.get<UsersController>(UsersController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
// >>>>>>>>>>>>>>>> 1.UserService와 UsersController의 의존성 해결
// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersController } from './users.controller';
// import { UsersService } from './users.service';

// describe('UsersController', () => {
//   let controller: UsersController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//       providers: [
//         {
//           provide: UsersService,
//           useValue: {}, // UsersService의 mock 객체 제공
//         },
//       ],
//     }).compile();

//     controller = module.get<UsersController>(UsersController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
