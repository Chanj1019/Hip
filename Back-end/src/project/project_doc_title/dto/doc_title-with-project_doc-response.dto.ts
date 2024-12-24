import { ProjectDocResponseDto } from "src/project/project_doc/dto/project_doc-response.dto";
import { ProjectDocTitle } from "../entities/project_doc_title.entity";

export class DocTitleWithProjectDocResponseDto {
    project_doc_id: number;
    title: string;
    pa_title_id: number;
    project_docs: ProjectDocResponseDto[];
    sub_titles?: DocTitleWithProjectDocResponseDto[];
    
    constructor(docTitle: ProjectDocTitle) {
        this.project_doc_id = docTitle.project_doc_id;
        this.title = docTitle.title;
        this.pa_title_id = docTitle.pa_title_id;
        this.project_docs = docTitle.project_docs 
            ? docTitle.project_docs.map(projectDoc => new ProjectDocResponseDto(projectDoc))
            : [];
                
        // subTitles 관계가 있는 경우에만 변환
        if (docTitle.subTitles && docTitle.subTitles.length > 0) {
            this.sub_titles = docTitle.subTitles.map(
                subTitle => new DocTitleWithProjectDocResponseDto(subTitle)
            );
        }
    }
}
