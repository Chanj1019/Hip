import { Video } from "../entities/video.entity";

export class VideoResponseDto {
    video_topic_id: number;
    video_topic_title: string;

    constructor(video: Video) {
        this.video_topic_id = video.video_id;
        this.video_topic_title = video.video_title;
    }
}