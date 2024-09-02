import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConflictException, HttpException } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { HashService } from '../hash/hash.service';
import * as dotenv from 'dotenv';

dotenv.config();

process.env.JWT_SECRET = 'test_secret';

const mockUser: User = {
    user_id: 1,
    email: "example@example.com",
    password: "password123",
    nick_name: "nickname",
    generation: "2023",
    user_name: "사용자이름",
    id: "1",
    user_role: Role.STUDENT,
    exhibition: []
};

const mockUserRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    remove: jest.fn(),
};

describe('UsersService', () => {
    let service: UsersService;
    let repository: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                HashService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);
        repository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a user successfully', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed_password');

            const userData = {
                email: 'test@example.com',
                password: 'password',
                nick_name: 'testnick',
                id: 'testid',
                user_name: '',
                generation: '',
                user_role: Role.STUDENT
            };

            const result = await service.create(userData);
            expect(result).toEqual(mockUser);
            expect(repository.save).toHaveBeenCalledWith(mockUser);
        });

        it('should throw ConflictException for duplicate email', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);

            await expect(service.create({
                email: 'test@example.com',
                password: 'password',
                nick_name: 'newnick',
                id: 'testid',
                user_name: '',
                generation: '',
                user_role: Role.STUDENT
            })).rejects.toThrow(ConflictException);
        });

        it('should throw HttpException if password is missing', async () => {
            await expect(service.create({
                email: 'test@example.com',
                password: '',
                nick_name: 'testnick',
                id: 'testid',
                user_name: '',
                generation: '',
                user_role: Role.STUDENT
            })).rejects.toThrow(HttpException);
        });
    });

    describe('findAll', () => {
        it('should return an array of users', async () => {
            mockUserRepository.find.mockResolvedValue([mockUser]);

            const result = await service.findAll();
            expect(result).toEqual([mockUser]);
        });
    });

    describe('findOne', () => {
        it('should return a user by id', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);

            const result = await service.findOne(1);
            expect(result).toEqual(mockUser);
        });
    });

    describe('remove', () => {
        it('should remove a user by id', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);

            await service.remove(1);
            expect(repository.remove).toHaveBeenCalledWith(mockUser);
        });
    });

    describe('login', () => {
        it('should return a token for valid credentials', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            jest.spyOn(require('jsonwebtoken'), 'sign').mockReturnValue('token');

            const token = await service.login('testid', 'password');
            expect(token).toEqual('token');
        });

        it('should throw HttpException if user not found', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(service.login('wrongid', 'password')).rejects.toThrow(HttpException);
        });

        it('should throw HttpException if password is invalid', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

            await expect(service.login('testid', 'wrongpassword')).rejects.toThrow(HttpException);
        });
    });

    describe('update', () => {
        it('should update user details successfully', async () => {
            mockUserRepository.findOne.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'hash').mockResolvedValue('new_hashed_password');

            const result = await service.update(1, 'new@example.com', 'newpassword', 'newnick', '2023');
            expect(result).toEqual('User updated successfully');
            expect(mockUser.email).toEqual('new@example.com');
        });

        it('should throw HttpException if user not found', async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            await expect(service.update(999, 'new@example.com', 'newpassword', 'newnick', '2023')).rejects.toThrow(HttpException);
        });

        it('should throw HttpException if email already exists', async () => {
            const existingUser = { user_id: 2, email: 'test@example.com' };
            const mockUserToUpdate = { user_id: 1, email: 'original@example.com' };

            mockUserRepository.findOne
                .mockResolvedValueOnce(mockUserToUpdate)
                .mockResolvedValueOnce(existingUser);

            await expect(service.update(1, 'test@example.com', 'newpassword', 'newnick', '2023')).rejects.toThrow(HttpException);
        });
    });
});
