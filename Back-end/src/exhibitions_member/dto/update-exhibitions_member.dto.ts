import { PartialType } from '@nestjs/mapped-types';
import { CreateExhibitionsMemberDto } from './create-exhibitions_member.dto';

export class UpdateExhibitionsMemberDto extends PartialType(CreateExhibitionsMemberDto) {}
