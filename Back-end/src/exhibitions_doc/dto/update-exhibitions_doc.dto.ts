import { PartialType } from '@nestjs/mapped-types';
import { CreateExhibitionsDocDto } from './create-exhibitions_doc.dto';

export class UpdateExhibitionsDocDto extends PartialType(CreateExhibitionsDocDto) {}
