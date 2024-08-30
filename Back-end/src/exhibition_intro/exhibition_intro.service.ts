import { Injectable } from '@nestjs/common';
import { CreateExhibitionIntroDto } from './dto/create-exhibition_intro.dto';
import { UpdateExhibitionIntroDto } from './dto/update-exhibition_intro.dto';

@Injectable()
export class ExhibitionIntroService {
  create(createExhibitionIntroDto: CreateExhibitionIntroDto) {
    return 'This action adds a new exhibitionIntro';
  }

  findAll() {
    return `This action returns all exhibitionIntro`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exhibitionIntro`;
  }

  update(id: number, updateExhibitionIntroDto: UpdateExhibitionIntroDto) {
    return `This action updates a #${id} exhibitionIntro`;
  }

  remove(id: number) {
    return `This action removes a #${id} exhibitionIntro`;
  }
}
