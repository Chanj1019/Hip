import { IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateFeedbackDto {
    @IsOptional()
    @IsNotEmpty()
    content?: string;
}