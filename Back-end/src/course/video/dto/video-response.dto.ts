import { Video } from "../entities/video.entity";

export class VideoResponseDto {
    video_id: number;
    video_title: string;
    url: string;

    constructor(video: Video) {
        this.video_id = video.video_id;
        this.video_title = video.video_title;
        this.url = video.video_url
    }
}