import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VideoTopicService } from './video_topic.service';
import { CreateVideoTopicDto } from './dto/create-video_topic.dto';
import { UpdateVideoTopicDto } from './dto/update-video_topic.dto';

@Controller('video-topic')
export class VideoTopicController {
  constructor(private readonly videoTopicService: VideoTopicService) {}

  @Post()
  create(@Body() createVideoTopicDto: CreateVideoTopicDto) {
    return this.videoTopicService.create(createVideoTopicDto);
  }

  @Get()
  findAll() {
    return this.videoTopicService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videoTopicService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVideoTopicDto: UpdateVideoTopicDto) {
    return this.videoTopicService.update(+id, updateVideoTopicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.videoTopicService.remove(+id);
  }
}
