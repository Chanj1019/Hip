import { Injectable } from '@nestjs/common';
import { CreateExhibitionsMemberDto } from './dto/create-exhibitions_member.dto';
import { UpdateExhibitionsMemberDto } from './dto/update-exhibitions_member.dto';

@Injectable()
export class ExhibitionsMemberService {
  create(createExhibitionsMemberDto: CreateExhibitionsMemberDto) {
    return 'This action adds a new exhibitionsMember';
  }

  findAll() {
    return `This action returns all exhibitionsMember`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exhibitionsMember`;
  }

  update(id: number, updateExhibitionsMemberDto: UpdateExhibitionsMemberDto) {
    return `This action updates a #${id} exhibitionsMember`;
  }

  remove(id: number) {
    return `This action removes a #${id} exhibitionsMember`;
  }
}
