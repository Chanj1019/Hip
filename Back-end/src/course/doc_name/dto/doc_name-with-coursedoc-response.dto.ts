import { CourseDocResponseDto } from "src/course/course_doc/dto/course_doc-response.dto";
import { DocName } from "../entities/doc_name.entity";

export class DocNameResponseDto {
    topic_id: number;
    topic_title: string;
    course_doc: CourseDocResponseDto[];
    sub_topics?: DocNameResponseDto[];
    
    constructor(docName: DocName) {
        this.topic_id = docName.topic_id;
        this.topic_title = docName.topic_title;
        this.course_doc = docName.courseDocs 
            ? docName.courseDocs.map(courseDoc => new CourseDocResponseDto(courseDoc))
            : [];
            
        // subTopics relation이 있는 경우에만 변환
        if (docName.subTopics && docName.subTopics.length > 0) {
            this.sub_topics = docName.subTopics.map(
                subTopic => new DocNameResponseDto(subTopic)
            );
        }
    }
}