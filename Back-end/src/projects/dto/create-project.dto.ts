import { IsString, IsNotEmpty, IsEnum, IsInt, IsBoolean } from 'class-validator';
export enum Status {
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed'
}
export class CreateProjectDto {

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    team_name: string;

    @IsEnum(Status)
    status: Status;

    @IsInt()
    userId: number;
}
