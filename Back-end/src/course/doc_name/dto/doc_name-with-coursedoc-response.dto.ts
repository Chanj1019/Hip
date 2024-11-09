import { CourseDocResponseDto } from "src/course/course_doc/dto/course_doc-response.dto";
import { DocName } from "../entities/doc_name.entity";

export class DocNameResponseDto {
    topic_id: number;
    topic_title: string;
    pa_topic_id?: number;
    course_doc: CourseDocResponseDto[];
    
    constructor(docName: DocName) {
        this.topic_id = docName.topic_id;
        this.topic_title = docName.topic_title;
        this.pa_topic_id = docName.pa_topic_id;
        this.course_doc = docName.courseDocs ? docName.courseDocs.map(CourseDoc => new CourseDocResponseDto(CourseDoc)): [];
    }
}