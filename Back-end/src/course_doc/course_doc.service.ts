import { Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateCourseDocDto } from './dto/create-course_doc.dto';
import { UpdateCourseDocDto } from './dto/update-course_doc.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseDoc } from './entities/course_doc.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CourseDocService {
  private readonly logger = new Logger(CourseDocService.name);

  constructor(
    @InjectRepository(CourseDoc)
    private courseDocRepository: Repository<CourseDoc>,
  ){}

  async createCourseDoc(createCourseDocDto: CreateCourseDocDto, file: Express.Multer.File): Promise<CourseDoc> {
    try {
        const courseDoc = this.courseDocRepository.create(createCourseDocDto);
        if (file) {
            courseDoc.file_path = `uploads/${file.filename}`;  // 파일 경로 저장 (실제 파일 업로드 로직 필요)
        }
        await this.courseDocRepository.save(courseDoc);
        this.logger.log(`Course Document created: ${courseDoc.course_document_title}`);
        return courseDoc;
    } catch (error) {
        this.logger.error(`Failed to create Course Document: ${error.message}`);
        throw new InternalServerErrorException('Failed to create Course Document');
    } 
  }

  async findAll(): Promise<CourseDoc[]> {
    return this.courseDocRepository.find();
  }

  async findOne(id: number): Promise<CourseDoc> {
    const courseDoc = await this.courseDocRepository.findOne({ where: { course_document_id: id } });
    if (!courseDoc) {
      this.logger.warn(`Course document with ID ${id} not found`);
      throw new NotFoundException(`Course document with ID ${id} not found`);
    }
    return courseDoc;
  }

  async update(id: number, updateCourseDocDto: UpdateCourseDocDto, file: Express.Multer.File): Promise<CourseDoc> {
    const courseDoc = await this.findOne(id);
    Object.assign(courseDoc, updateCourseDocDto);
    if (file) {
        courseDoc.file_path = `uploads/${file.filename}`;  // 새 파일 경로 업데이트 (실제 파일 업로드 로직 필요)
    }
    await this.courseDocRepository.save(courseDoc);
    this.logger.log(`Course Document updated: ${courseDoc.course_document_title}`);
    return courseDoc;
  }

  async remove(id: number): Promise<void> {
    const result = await this.courseDocRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn(`Attempt to delete non-existent course document with ID ${id}`);
      throw new NotFoundException(`Course document with ID ${id} not found for deletion`);
    }
    this.logger.log(`Course Document with ID ${id} deleted`);
  }
}