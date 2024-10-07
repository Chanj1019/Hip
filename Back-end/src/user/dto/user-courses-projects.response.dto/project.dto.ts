// src/user/dto/project.dto.ts
export class ProjectDto {
    project_id: number;
    topic: string;
    class: string;
    project_status: 'in_progress' | 'completed';
    team_name?: string; // nullable 속성은 선택적
    profile?: string; // nullable 속성은 선택적
    requirements?: string; // nullable 속성은 선택적
}
