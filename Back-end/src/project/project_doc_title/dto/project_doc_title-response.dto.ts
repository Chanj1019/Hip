import { ProjectDocTitle } from '../entities/project_doc_title.entity';
import { ProjectDocResponseDto } from 'src/project/project_doc/dto/project_doc-response.dto';

export class ProjectDocTitleResponseDto {
    project_doc_title_id: number;
    project_doc_title: string;
    project_doc_data: ProjectDocResponseDto[];

    constructor(projectDocTitle: ProjectDocTitle) {
        this.project_doc_title_id = projectDocTitle.project_doc_title_id;
        this.project_doc_title = projectDocTitle.project_doc_title;
        this.project_doc_data = (projectDocTitle.project_docs || []).map(projectDoc => 
            new ProjectDocResponseDto(projectDoc)
        );
    }
}

export class NestedProjectDocTitleResponseDto {
    project_doc_title_id: number;
    project_doc_title: string;
    subTitles: NestedProjectDocTitleResponseDto[];

    constructor(projectDocTitle: ProjectDocTitle) {
        this.project_doc_title_id = projectDocTitle.project_doc_title_id;
        this.project_doc_title = projectDocTitle.project_doc_title;
        this.subTitles = (projectDocTitle.subTitles || []).map(subTitle => 
            new NestedProjectDocTitleResponseDto(subTitle)
        );
    }
}