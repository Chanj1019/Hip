import { IsString, IsEmail, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from '../../enums/role.enum';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    user_name: string;

    @IsString()
    @IsNotEmpty()
    id: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    nick_name: string;

    @IsEnum(Role) // enum 검증 추가
    role_id: Role; 
}
