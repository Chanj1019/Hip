import { IsInt, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateExhibitionsMemberDto {
    @IsNotEmpty()
    exhibitions_id: number; // 외래 키

    @IsString()
    @IsNotEmpty() // 이름은 필수
    name: string; // 이름

    @IsOptional() // 닉네임은 선택적
    @IsString()
    nick_name?: string; // 닉네임

    @IsString()
    @IsNotEmpty() // 기수는 필수
    generation: string; // 기수
}
