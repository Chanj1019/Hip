import { IsNotEmpty } from 'class-validator';

export class CreateFeedbackDto {
    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    projectDocId: number; // project_doc의 ID
}
