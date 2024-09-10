import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post()
  create(@Body() createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  findAll(): Promise<Feedback[]> {
    return this.feedbackService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Feedback> {
    return this.feedbackService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
    return this.feedbackService.update(id, updateFeedbackDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.feedbackService.remove(id);
  }
}