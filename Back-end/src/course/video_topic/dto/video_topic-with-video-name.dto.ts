import { VideoTopic } from "../entities/video_topic.entity";

export class VideoTopicWithVideoTitle {
    video_topic_id: number;
    video_topic_title: string;
    videos: { video_id: number, video_title: string }[];  // 비디오 정보를 단순화

    constructor(video_topic: VideoTopic) {
        this.video_topic_id = video_topic.video_topic_id;
        this.video_topic_title = video_topic.video_topic_title;
        // videos 배열이 있을 경우 video_id와 video_title만 매핑
        this.videos = video_topic.videos 
            ? video_topic.videos.map(video => ({
                video_id: video.video_id,
                video_title: video.video_title
            }))
            : [];
    }
}