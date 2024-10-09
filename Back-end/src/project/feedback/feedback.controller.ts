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
@Controller('projects/:projectId/projectDocs/:projectDocs/feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) {}

    @Post('register')
    @Roles('instructor')
    async create(
        @Body() createFeedbackDto: CreateFeedbackDto,
        @Param('projectId') projectId: number,
        @Param('projectDocs') projectDocId: number
    ): Promise<Feedback> {
        return await this.feedbackService.create(createFeedbackDto, projectId, projectDocId);
    }

    @Get('allFeedback')
    async findAll(
        @Param('projectId') projectId: number,
        @Param('projectDocs') projectDocId: number
    ): Promise<Feedback[]> {
        return await this.feedbackService.findAll(projectId, projectDocId);
    }

    @Get(':id/read')
    async findOne(
        @Param('id') id: number,
        @Param('projectId') projectId: number,
        @Param('projectDocs') projectDocId: number
    ): Promise<Feedback> {
        return await this.feedbackService.findOne(id, projectId, projectDocId);
    }

    @Patch(':id/update')
    @Roles('instructor')
    async update(
        @Param('id') id: number, 
        @Body() updateFeedbackDto: UpdateFeedbackDto,
        @Param('projectId') projectId: number,
        @Param('projectDocs') projectDocId: number
    ): Promise<Feedback> {
        return await this.feedbackService.update(id, updateFeedbackDto, projectId, projectDocId);
    }

    @Delete(':id/delete')
    @Roles('instructor')
    async remove(
        @Param('id') id: number,
        @Param('projectId') projectId: number,
        @Param('projectDocs') projectDocId: number
    ): Promise<void> {
        return await this.feedbackService.remove(id, projectId, projectDocId);
    }
}
