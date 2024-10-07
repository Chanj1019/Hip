import { IsNotEmpty, IsString, IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CreateExhibitionIntroDto {
    @IsNotEmpty()
    exhibition_id: number;

    @IsArray()
    @ArrayMinSize(1)  // 최소 1개
    @ArrayMaxSize(3)  // 최대 3개
    @IsString({ each: true }) // 각 요소가 문자열인지 확인
    introduce: string[]; // 소개를 배열로 받음
}
