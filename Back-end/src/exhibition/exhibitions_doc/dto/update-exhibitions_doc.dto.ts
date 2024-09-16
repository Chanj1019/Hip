import { PartialType } from '@nestjs/mapped-types';
import { CreateExhibitionsDocDto } from './create-exhibitions_doc.dto';
import { IsString, IsOptional } from 'class-validator';


export class UpdateExhibitionsDocDto extends PartialType(CreateExhibitionsDocDto) {

    @IsOptional() 
    @IsString()
    feedback?: string; 

}
