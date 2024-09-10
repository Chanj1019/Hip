import { PartialType } from '@nestjs/mapped-types';
import { CreateExhibitionsDocDto } from './create-exhibitions_doc.dto';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';


export class UpdateExhibitionsDocDto extends PartialType(CreateExhibitionsDocDto) {

    @IsOptional() // 피드백은 선택적
    @IsString()
    feedback?: string; // 피드백 (선택적)

}
