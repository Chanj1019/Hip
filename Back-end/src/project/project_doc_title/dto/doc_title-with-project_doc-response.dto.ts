import { ProjectDocResponseDto } from "src/project/project_doc/dto/project_doc-response.dto";
import { ProjectDocTitle } from "../entities/project_doc_title.entity";

export class DocTitleWithProjectDocResponseDto {
    project_doc_title_id: number;
    project_doc_title: string;
    project_docs: ProjectDocResponseDto[];
    sub_titles?: DocTitleWithProjectDocResponseDto[];
    
    constructor(projectDocTitle: ProjectDocTitle) {
        this.project_doc_title_id = projectDocTitle.project_doc_title_id;
        this.project_doc_title = projectDocTitle.project_doc_title;
        this.project_docs = projectDocTitle.project_docs 
            ? projectDocTitle.project_docs.map(projectDoc => new ProjectDocResponseDto(projectDoc))
            : [];
                
        // subTitles 관계가 있는 경우에만 변환
        if (projectDocTitle.subTitles && projectDocTitle.subTitles.length > 0) {
            this.sub_titles = projectDocTitle.subTitles.map(
                subTitle => new DocTitleWithProjectDocResponseDto(subTitle)
            );
        }
    }
}
