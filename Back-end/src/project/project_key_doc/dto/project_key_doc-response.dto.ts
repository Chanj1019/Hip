import { ProjectResponseDto } from "src/project/projects/dto/project-response.dto";
import { ProjectKeyDoc } from "../entities/project_key_doc.entity";

export class ProjectKeyDocResponseDto {
    key_doc_id: number;
    key_doc_title: string;
    key_doc_url: string;
    key_doc_category: string;
    project_data: ProjectResponseDto;

    constructor(entity: ProjectKeyDoc) {
        this.key_doc_id = entity.key_doc_id;
        this.key_doc_title = entity.key_doc_title;
        this.key_doc_url = entity.key_doc_url;
        this.key_doc_category = entity.key_doc_category;
        this.project_data = new ProjectResponseDto(entity.project);
    }
}