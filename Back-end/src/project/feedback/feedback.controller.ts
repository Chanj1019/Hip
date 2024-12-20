import { Controller, Get, Post, Body, Param, Delete, Patch, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Feedback } from './entities/feedback.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { ApprovedStudentGuard } from '../../auth/project.approved.guard';
import { ApiResponse } from 'src/common/api-response.dto';
import { FeedbackResponseDto } from './dto/feedback-response.dto';
import { HttpStatus } from '@nestjs/common';

@UseGuards(JwtAuthGuard, RolesGuard, ApprovedStudentGuard)
@Controller('projects/:project/projectDocs/:projectDoc/feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) {}

    @Post('register')
    @Roles('instructor')
    async create(
        @Body() createFeedbackDto: CreateFeedbackDto,
        @Param('project') projectId: number,
        @Param('projectDoc') projectDocId: number
    ): Promise<ApiResponse<FeedbackResponseDto>> {
        const data = await this.feedbackService.create(createFeedbackDto, projectId, projectDocId);
        const responseData = new FeedbackResponseDto(data);
        return new ApiResponse<FeedbackResponseDto>(HttpStatus.OK, '피드백이 성공적으로 등록되었습니다.', responseData);
    }

    @Get('allFeedback')
    async findAll(
        @Param('project') projectId: number,
        @Param('projectDoc') projectDocId: number
    ): Promise<ApiResponse<FeedbackResponseDto[]>> {
        const data = await this.feedbackService.findAll(projectId, projectDocId);
        const responseData = data.map(feedback => new FeedbackResponseDto(feedback));
        return new ApiResponse<FeedbackResponseDto[]>(HttpStatus.OK, '전체 피드백 조회를 완료했습니다.', responseData);
    }

    @Get(':id/read')
    async findOne(
        @Param('id') id: number,
        @Param('project') projectId: number,
        @Param('projectDoc') projectDocId: number
    ): Promise<ApiResponse<FeedbackResponseDto>> {
        const data = await this.feedbackService.findOne(id, projectId, projectDocId);
        const responseData = new FeedbackResponseDto(data);
        return new ApiResponse<FeedbackResponseDto>(HttpStatus.OK, '피드백 조회를 완료했습니다.', responseData);
    }

    @Patch(':id/update')
    @Roles('instructor')
    async update(
        @Param('id') id: number, 
        @Body() updateFeedbackDto: UpdateFeedbackDto,
        @Param('project') projectId: number,
        @Param('projectDoc') projectDocId: number
    ): Promise<ApiResponse<FeedbackResponseDto>> {
        const data = await this.feedbackService.update(id, updateFeedbackDto, projectId, projectDocId);
        const responseData = new FeedbackResponseDto(data);
        return new ApiResponse<FeedbackResponseDto>(HttpStatus.OK, '피드백이 성공적으로 수정되었습니다.', responseData);
    }

    @Delete(':id/delete')
    @Roles('instructor')
    async remove(
        @Param('id') id: number,
        @Param('project') projectId: number,
        @Param('projectDoc') projectDocId: number
    ): Promise<{ message: string }> {
        await this.feedbackService.remove(id, projectId, projectDocId);
        return { message: '성공적으로 삭제되었습니다.' };
    }
}
