import { PartialType } from '@nestjs/mapped-types';
import { CreateExhibitionsMemberDto } from './create-exhibitions_member.dto';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';


export class UpdateExhibitionsMemberDto extends PartialType(CreateExhibitionsMemberDto) {
    @IsOptional() 
    @IsString()
    @IsNotEmpty() 
    name?: string; 

    @IsOptional() 
    @IsString()
    nick_name?: string; 

    @IsOptional() 
    @IsString()
    @IsNotEmpty() 
    generation?: string; 
}
