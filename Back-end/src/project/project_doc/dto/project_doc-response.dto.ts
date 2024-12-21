import { ProjectDoc } from '../entities/project_doc.entity';
import { FeedbackResponseDto } from '../../feedback/dto/feedback-response.dto';
import { ProjectResponseDto } from 'src/project/projects/dto/project-response.dto';

export class ProjectDocResponseDto {
    project_doc_id: number;
    description: string;
    file_path: string;
    project_doc_title: string;
    project_data: ProjectResponseDto;
    feedback_data: FeedbackResponseDto[];

    constructor(projectDoc: ProjectDoc) {
        this.project_doc_id = projectDoc.project_doc_id;
        this.description = projectDoc.description;
        this.file_path = projectDoc.file_path;
        this.project_doc_title = projectDoc.project_doc_title;
        this.project_data = new ProjectResponseDto(projectDoc.project);
        this.feedback_data = projectDoc.feedbacks.map(feedback => new FeedbackResponseDto(feedback));
    }
}