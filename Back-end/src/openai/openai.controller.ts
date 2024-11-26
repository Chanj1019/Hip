import { Controller, Post, Body } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
    constructor(private readonly openaiService: OpenaiService) {}

    @Post('generate-text')
    async generateText(@Body() body: { prompt: string }): Promise<{ result: string }> {
        const result = await this.openaiService.generateText(body.prompt);
        return { result };
    }

    @Post('process-video')
    async processVideo(@Body() body: { videoUrl: string }): Promise<{ transcription: string; summary: string }> {
        const result = await this.openaiService.processVideo(body.videoUrl);
        return result;
    }
}
