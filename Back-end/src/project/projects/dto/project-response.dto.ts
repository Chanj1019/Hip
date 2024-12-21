import { Project } from "../entities/project.entity";

export class ProjectResponseDto {
    project_id: number;
    topic: string;
    className: string;
    project_status: 'in_progress' | 'completed';
    team_name: string;
    generation: string;

    constructor(project: Project) {
        this.project_id = project.project_id;
        this.topic = project.topic;
        this.className = project.className;
        this.project_status = project.project_status;
        this.team_name = project.team_name;
        this.generation = project.generation;
    }
}