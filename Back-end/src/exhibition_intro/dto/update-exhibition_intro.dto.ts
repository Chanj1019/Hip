import { PartialType } from '@nestjs/mapped-types';
import { CreateExhibitionIntroDto } from './create-exhibition_intro.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateExhibitionIntroDto extends PartialType(CreateExhibitionIntroDto) {

  @IsOptional()
  @IsString()
  introduce?: string;


}
