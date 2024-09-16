import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateExhibitionsDocDto {

    @IsOptional() // 피드백은 선택적
    @IsString()
    feedback?: string; // 피드백 (선택적)

    @IsNotEmpty() // 외래키는 필수
    exhibition_id: number; // 외래 키 (Exhibition ID)
}


