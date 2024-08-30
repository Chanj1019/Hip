import { PartialType } from '@nestjs/mapped-types';
import { CreateExhibitionIntroDto } from './create-exhibition_intro.dto';

export class UpdateExhibitionIntroDto extends PartialType(CreateExhibitionIntroDto) {}
