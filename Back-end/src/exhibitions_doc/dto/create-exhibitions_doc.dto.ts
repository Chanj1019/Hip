import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateExhibitionsDocDto {
    @IsString()
    @IsNotEmpty() // 파일 경로는 필수
    file_path: string; // 파일 경로

    @IsOptional() // 피드백은 선택적
    @IsString()
    feedback?: string; // 피드백 (선택적)

    @IsNotEmpty() // 외래키는 필수
    exhibition_id: number; // 외래 키 (Exhibition ID)
}


