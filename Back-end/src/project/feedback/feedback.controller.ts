import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { ApprovedStudentGuard } from '../../auth/project.approved.guard';

@UseGuards(JwtAuthGuard, RolesGuard, ApprovedStudentGuard)
@Controller('feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) {}

    @Post()
    @Roles('instructor')
    async create(@Body() createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
        return await this.feedbackService.create(createFeedbackDto);
    }

    @Get()
    async findAll(): Promise<Feedback[]> {
        return await this.feedbackService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Feedback> {
        return await this.feedbackService.findOne(id);
    }

    @Patch(':id')
    @Roles('instructor')
    async update(@Param('id') id: number, @Body() updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
        return await this.feedbackService.update(id, updateFeedbackDto);
    }

    @Delete(':id')
    @Roles('instructor')
    async remove(@Param('id') id: number): Promise<void> {
        return await this.feedbackService.remove(id);
    }
}
