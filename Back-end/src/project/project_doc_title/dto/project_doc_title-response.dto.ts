import { ProjectDocTitle } from '../entities/project_doc_title.entity';
import { ProjectDocResponseDto } from 'src/project/project_doc/dto/project_doc-response.dto';

export class ProjectDocTitleResponseDto {
    project_doc_title_id: number;
    project_doc_title: string;
    project_doc_title_pa_id: number;
    project_doc_data: ProjectDocResponseDto[];

    constructor(projectDocTitle: ProjectDocTitle) {
        this.project_doc_title_id = projectDocTitle.project_doc_title_id;
        this.project_doc_title = projectDocTitle.project_doc_title;
        this.project_doc_title_pa_id = projectDocTitle.project_doc_title_pa_id
            ? projectDocTitle.project_doc_title_pa_id.project_doc_title_id
            : null;
        this.project_doc_data = (projectDocTitle.project_docs || []).map(projectDoc => 
            new ProjectDocResponseDto(projectDoc)
        );
    }
}

export class NestedProjectDocTitleResponseDto {
    project_doc_title_id: number;
    project_doc_title: string;
    project_doc_title_pa_id: number;
    sub_titles: NestedProjectDocTitleResponseDto[];

    constructor(projectDocTitle: ProjectDocTitle) {
        this.project_doc_title_id = projectDocTitle.project_doc_title_id;
        this.project_doc_title = projectDocTitle.project_doc_title;
        this.project_doc_title_pa_id = projectDocTitle.project_doc_title_pa_id
            ? projectDocTitle.project_doc_title_pa_id.project_doc_title_id
            : null;
        this.sub_titles = (projectDocTitle.sub_titles || []).map(sub_titles => 
            new NestedProjectDocTitleResponseDto(sub_titles)
        );
    }
}