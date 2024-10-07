import { Video } from "../entities/video.entity";

export class DocNameResponseDto {
    video_id: number;
    video_url: string;

    constructor(video: Video) {
        this.video_id = video.video_id;
        this.video_url = video.video_url;
    }
}