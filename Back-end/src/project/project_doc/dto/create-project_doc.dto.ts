import { IsString } from 'class-validator';

export class CreateProjectDocDto {
    @IsString()
    description: string;

    @IsString()
    project_id: number;

    // @IsInt()
    // userId: number;
}
