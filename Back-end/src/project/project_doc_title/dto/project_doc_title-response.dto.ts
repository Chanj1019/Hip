import { ProjectDocTitle } from '../entities/project_doc_title.entity';
import { FeedbackResponseDto } from '../../feedback/dto/feedback-response.dto';
import { ProjectResponseDto } from 'src/project/projects/dto/project-response.dto';

export class ProjectDocTitleResponseDto {
    project_doc_title_id: number;
    description: string;
    file_path: string;
    title: string;
    project_data: ProjectResponseDto;
    feedback_data: FeedbackResponseDto[];

    constructor(projectDocTitle: ProjectDocTitle) {
        this.project_doc_title_id = projectDocTitle.project_doc_id;
        this.description = projectDocTitle.description;
        this.file_path = projectDocTitle.file_path;
        this.title = projectDocTitle.title;
        this.project_data = new ProjectResponseDto(projectDocTitle.project);
        this.feedback_data = projectDocTitle.feedbacks.map(feedback => new FeedbackResponseDto(feedback));
    }
}