import { ProjectDoc } from '../entities/project_doc.entity';
import { FeedbackResponseDto } from '../../feedback/dto/feedback-response.dto';
import { ProjectResponseDto } from 'src/project/projects/dto/project-response.dto';

export class ProjectDocResponseDto {
    project_doc_id: number;
    url: string;
    title: string;
    feedback_data: FeedbackResponseDto[];

    constructor(projectDocTitle: ProjectDoc) {
        this.project_doc_id = projectDocTitle.project_doc_id;
        this.url = projectDocTitle.url;
        this.title = projectDocTitle.title;
        this.feedback_data = projectDocTitle.feedbacks.map(feedback => new FeedbackResponseDto(feedback));
    }
}