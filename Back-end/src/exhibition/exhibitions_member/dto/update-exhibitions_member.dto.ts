import { PartialType } from '@nestjs/mapped-types';
import { CreateExhibitionsMemberDto } from './create-exhibitions_member.dto';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';


export class UpdateExhibitionsMemberDto extends PartialType(CreateExhibitionsMemberDto) {
    @IsOptional() // 선택적 필드
    @IsString()
    @IsNotEmpty() // 비어 있을 수 없음
    name?: string; // 이름

    @IsOptional() // 선택적 필드
    @IsString()
    nick_name?: string; // 닉네임

    @IsOptional() // 선택적 필드
    @IsString()
    @IsNotEmpty() // 비어 있을 수 없음
    generation?: string; // 기수
}
