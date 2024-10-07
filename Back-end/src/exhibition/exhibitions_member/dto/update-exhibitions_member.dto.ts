import { PartialType } from '@nestjs/mapped-types';
import { CreateExhibitionMemberDto, CreateExhibitionsMembersDto } from './create-exhibitions_member.dto';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateExhibitionMemberDto extends PartialType(CreateExhibitionsMembersDto) {
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
