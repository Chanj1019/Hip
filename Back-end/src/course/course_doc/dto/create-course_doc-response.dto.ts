import { CourseDoc } from "../entities/course_doc.entity";

export class DocNameResponseDto {
    course_document_id: number;
    upload_date: Date;
    file_path: string;

    constructor(courseDoc: CourseDoc) {
        this.course_document_id = courseDoc.course_document_id;
        this.upload_date = courseDoc.upload_date;
        this.file_path = courseDoc.file_path;
    }
}