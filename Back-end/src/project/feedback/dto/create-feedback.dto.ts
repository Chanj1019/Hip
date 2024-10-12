import { IsNotEmpty } from 'class-validator';

export class CreateFeedbackDto {
    @IsNotEmpty()
    feedback_content: string;
}
