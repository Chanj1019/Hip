import { IsArray, ValidateNested, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExhibitionsMembersDto {
    @IsNotEmpty()
    exhibitions_id: number; // exhibitions_id는 필수

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateExhibitionMemberDto)
    members: CreateExhibitionMemberDto[]; // members는 CreateExhibitionMemberDto 배열
}

export class CreateExhibitionMemberDto {
    @IsNotEmpty()
    @IsString()
    name: string; // name은 단일 문자열

    @IsNotEmpty()
    @IsString()
    generation: string; // generation은 단일 문자열

    // image 필드를 제거하고, file_path를 사용하여 이미지 URL을 저장할 수 있도록 합니다.
    // image?: Express.Multer.File; // 이 줄은 제거하세요
}

// 추가: 반환할 멤버 DTO를 생성하여 S3에서 받은 URL을 포함할 수 있도록 합니다.
export class ExhibitionMemberResponseDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    generation: string;

    @IsNotEmpty()
    file_path: string; // S3에서 저장된 파일 경로
}
