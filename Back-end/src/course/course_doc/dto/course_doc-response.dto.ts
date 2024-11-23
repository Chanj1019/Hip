import { CourseDoc } from "../entities/course_doc.entity";

export class CourseDocResponseDto {
    upload_date: Date;
    file_path: string;
    file_name: string;

    constructor(courseDoc: CourseDoc) {
        this.upload_date = courseDoc.upload_date;
        this.file_path = courseDoc.file_path;
    }
}