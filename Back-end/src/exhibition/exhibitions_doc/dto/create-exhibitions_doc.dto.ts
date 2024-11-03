import { IsInt, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateExhibitionsDocDto {
    @IsNotEmpty()
    exhibitions_id: number;

    @IsOptional()
    outputImages?: Express.Multer.File[]; // 이미지 파일 배열

    @IsOptional()
    outputVideo?: Express.Multer.File[]; // 비디오 파일 배열
}
