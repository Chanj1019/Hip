import { PartialType } from '@nestjs/mapped-types';
import { CreateExhibitionIntroDto } from './create-exhibition_intro.dto';
import { IsOptional, IsArray, IsString, ArrayMinSize, ArrayMaxSize, IsNotEmpty } from 'class-validator';

export class UpdateExhibitionIntroDto extends PartialType(CreateExhibitionIntroDto) {

    @IsOptional()
    @IsNotEmpty()
    exhibition_id: number; // 추가된 전시 ID
    
    @IsOptional()
    @IsArray()
    @ArrayMinSize(1)  // 최소 1개
    @ArrayMaxSize(3)  // 최대 3개
    @IsString({ each: true }) // 각 요소가 문자열인지 확인
    introduce?: string[]; // 소개를 배열로 받음
}
