import { VideoTopic } from "../entities/video_topic.entity";

export class DocNameResponseDto {
    video_topic_id: number;
    video_topic_title: string;
    video_pa_topic_id: number

    constructor(videoTopic: VideoTopic) {
        this.video_topic_id = videoTopic.video_topic_id;
        this.video_topic_title = videoTopic.video_topic_title;
        this.video_pa_topic_id = videoTopic.video_pa_topic_id;
        
    }
}