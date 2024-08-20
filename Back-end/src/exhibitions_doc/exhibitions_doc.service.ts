import { Injectable } from '@nestjs/common';
import { CreateExhibitionsDocDto } from './dto/create-exhibitions_doc.dto';
import { UpdateExhibitionsDocDto } from './dto/update-exhibitions_doc.dto';

@Injectable()
export class ExhibitionsDocService {
  create(createExhibitionsDocDto: CreateExhibitionsDocDto) {
    return 'This action adds a new exhibitionsDoc';
  }

  findAll() {
    return `This action returns all exhibitionsDoc`;
  }

  findOne(id: number) {
    return `This action returns a #${id} exhibitionsDoc`;
  }

  update(id: number, updateExhibitionsDocDto: UpdateExhibitionsDocDto) {
    return `This action updates a #${id} exhibitionsDoc`;
  }

  remove(id: number) {
    return `This action removes a #${id} exhibitionsDoc`;
  }
}
