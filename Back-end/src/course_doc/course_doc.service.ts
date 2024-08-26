import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseDoc } from './entities/course_doc.entity';
import { DocName } from '../doc_name/entities/doc_name.entity';
import { CreateCourseDocDto } from './dto/create-course_doc.dto';
import { UpdateCourseDocDto } from './dto/update-course_doc.dto';

@Injectable()
export class CourseDocService {
  constructor(
    @InjectRepository(CourseDoc)
    private readonly courseDocRepository: Repository<CourseDoc>,
    @InjectRepository(DocName)
    private readonly docNameRepository: Repository<DocName>,
  ) {}

  async createfile(courseId: number, docNameId: number, createCourseDocDto: CreateCourseDocDto, file: Express.Multer.File): Promise<CourseDoc> {
      const docName = await this.docNameRepository.findOne({
      where: { topic_id: docNameId, course_id: courseId }
    });

    if (!docName) {
      throw new NotFoundException(`DocName with id ${docNameId} not found for course ${courseId}`);
    }

    const courseDoc = this.courseDocRepository.create({...createCourseDocDto, docName: docName, file_path: file.path,});

    return await this.courseDocRepository.save(courseDoc);
  }

  async createtext(courseId: number, docNameId: number, createCourseDocDto: CreateCourseDocDto): Promise<CourseDoc> {
      const docName = await this.docNameRepository.findOne({ 
        where: { topic_id: docNameId, course_id: courseId }
    });

    if (!docName) {
      throw new NotFoundException(`DocName with id ${docNameId} not found for course ${courseId}`);
    }

    const courseDoc = this.courseDocRepository.create({ ...createCourseDocDto, docName: docName, file_path: null,});

    return await this.courseDocRepository.save(courseDoc);
  }

  async findAll(courseId: number, docNameId: number): Promise<CourseDoc[]> {
    return await this.courseDocRepository.find({ 
      where: { docName: { topic_id: docNameId, course_id: courseId } }, 
      relations: ['docName'],
    });
  }

  async findOne(courseId: number, docNameId: number, id: number): Promise<CourseDoc> {
    const courseDoc = await this.courseDocRepository.findOne({
      where: { course_document_id: id, docName: { topic_id: docNameId, course_id: courseId } },
      relations: ['docName']
    });

    if (!courseDoc) {
      throw new NotFoundException(`Course Document with id ${id} not found`);
    }

    return courseDoc;
  }

  async update( courseId: number, docNameId: number, id: number, updateCourseDocDto: UpdateCourseDocDto, file?: Express.Multer.File): Promise<CourseDoc> {
    const courseDoc = await this.findOne(courseId, docNameId, id);

    Object.assign(courseDoc, updateCourseDocDto);

    if (file) {
      courseDoc.file_path = file.path;
    }

    return await this.courseDocRepository.save(courseDoc);
  }

  async remove(courseId: number, docNameId: number, id: number): Promise<void> {
    const courseDoc = await this.findOne(courseId, docNameId, id);
    await this.courseDocRepository.remove(courseDoc);
  }
}