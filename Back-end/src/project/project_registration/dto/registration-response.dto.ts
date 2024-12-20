import { UserResponseDto } from "src/user/dto/user-response.dto";
import { ProjectRegistration } from "../entities/registration.entity";
import { ProjectResponseDto } from "src/project/projects/dto/project-response.dto";

export class ProjectRegistrationResponseDto {
    project_registration_id: number;
    reporting_date: Date;
    registration_status: string;
    project_role: string;
    team_role: string;
    user_data: UserResponseDto;
    project_data: ProjectResponseDto;

    constructor(entity: ProjectRegistration) {
        this.project_registration_id = entity.project_registration_id;
        this.reporting_date = entity.reporting_date;
        this.registration_status = entity.registration_status;
        this.project_role = entity.project_role;
        this.team_role = entity.team_role;
        this.user_data = new UserResponseDto(entity.user);
        this.project_data = new ProjectResponseDto(entity.project);
    }
}