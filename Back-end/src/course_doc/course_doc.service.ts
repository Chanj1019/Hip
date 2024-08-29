import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  private async findDocName(courseTitle: string, docNameTitle: string): Promise<DocName> {
    const docName = await this.docNameRepository.findOne({
      where: { topic_title: docNameTitle, course_title: courseTitle },
    });

    if (!docName) {
      throw new NotFoundException(`DocName with id ${docNameTitle} not found for course ${courseTitle}`);
    }

    return docName;
  }

  private async createCourseDoc(
    createCourseDocDto: CreateCourseDocDto, 
    docName: DocName, 
    filePath: string | null
  ): Promise<CourseDoc> {
    const courseDoc = this.courseDocRepository.create({ 
      ...createCourseDocDto, 
      docName, 
      file_path: filePath 
    });

    return await this.courseDocRepository.save(courseDoc);
  }

  async create(courseTitle: string, docNameTitle: string, createCourseDocDto: CreateCourseDocDto, file: Express.Multer.File): Promise<CourseDoc> {
    if (!file) {
      throw new BadRequestException('파일이 업로드되지 않았습니다.');
    }

    const docName = await this.findDocName(courseTitle, docNameTitle);
    
    return await this.createCourseDoc(createCourseDocDto, docName, file.path);
  }

  async findAll(courseTitle: string, docNameTitle: string): Promise<CourseDoc[]> {
    return await this.courseDocRepository.find({ 
      where: { docName: { topic_title: docNameTitle, course_title: courseTitle } }, 
      relations: ['docName'],
    });
  }

  async findOne(courseTitle: string, docNameTitle: string, id: number): Promise<CourseDoc> {
    const courseDoc = await this.courseDocRepository.findOne({
      where: { course_document_id: id, docName: { topic_title: docNameTitle, course_title: courseTitle } },
      relations: ['docName'],
    });

    if (!courseDoc) {
      throw new NotFoundException(`Course Document with id ${id} not found`);
    }

    return courseDoc;
  }

  async update(courseTitle: string, docNameTitle: string, id: number, updateCourseDocDto: UpdateCourseDocDto, file?: Express.Multer.File): Promise<CourseDoc> {
    const courseDoc = await this.findOne(courseTitle, docNameTitle, id);

    Object.assign(courseDoc, updateCourseDocDto);

    if (file) {
      courseDoc.file_path = file.path;
    }

    return await this.courseDocRepository.save(courseDoc);
  }

  async remove(courseTitle: string, docNameTitle: string, id: number): Promise<void> {
    const courseDoc = await this.findOne(courseTitle, docNameTitle, id);
    await this.courseDocRepository.remove(courseDoc);
  }
}
