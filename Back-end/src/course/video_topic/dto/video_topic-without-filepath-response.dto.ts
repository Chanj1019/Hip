import { VideoTopic } from "../entities/video_topic.entity";

export class VideoTopicWithoutFilePathResponseDto {
    video_topic_id: number;
    video_topic_title: string;

    constructor(video: VideoTopic) {
        this.video_topic_id = video.video_topic_id;
        this.video_topic_title = video.video_topic_title;
    }
}