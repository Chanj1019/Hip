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
}
