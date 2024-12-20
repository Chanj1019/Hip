import { Feedback } from "../entities/feedback.entity";

export class FeedbackResponseDto {
    feedback_id: number;
    feedback_content: string;
    projectDocId: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(feedback: Feedback) {
        this.feedback_id = feedback.feedback_id;
        this.feedback_content = feedback.feedback_content;
        this.projectDocId = feedback.projectDoc.project_doc_id;
        this.createdAt = feedback.createdAt;
        this.updatedAt = feedback.updatedAt;
    }
}