import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as ffmpeg from 'fluent-ffmpeg';
import { createWriteStream } from 'fs';
import * as fs from 'fs';
import * as FormData from 'form-data';

@Injectable()
export class OpenaiService {
    private readonly apiKey: string = process.env.OPENAI_API_KEY; // 환경변수에서 API 키를 가져옵니다.

    async generateText(prompt: string): Promise<string> {
        const url = 'https://api.openai.com/v1/chat/completions'; // OpenAI API endpoint

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
        };

        const data = {
            model: 'gpt-4o-mini', // 사용할 모델
            messages: [{ role: 'user', content: prompt }],
        };

        try {
            const response = await axios.post(url, data, { headers });
            const generatedText = response.data.choices[0].message.content;
            return generatedText;
        } catch (error) {
            console.error('Error generating text:', error);
            throw new Error('Failed to generate text');
        }
    }

    async summarizeText(text: string): Promise<string> {
        const prompt = 
        `
아래의 텍스트는 강의 영상에서 추출한 내용이다. 이 텍스트를 읽고 다음 중요 사항을 포함하는 요약문을 작성해라:
* 강의의 주제와 핵심 메시지
* 강의에서 다룬 주요 개념, 이론, 아이디어
* 실습한 내용이 있다면 실습 내용
* 1번, 2번, 3번,... 번호를 매겨 대답
[강의 텍스트]
${text}`;
        return this.generateText(prompt);
    }

    async processVideo(videoUrl: string): Promise<{ summary: string }> {
        const videoPath = 'temp_video.mp4';
        const audioPath = 'temp_audio.wav';
    
        try {
            // 프리사인드 URL을 사용하여 비디오 다운로드
            const response = await axios({
                url: videoUrl,
                method: 'GET',
                responseType: 'stream',
            });
    
            const videoStream = createWriteStream(videoPath);
            response.data.pipe(videoStream);
    
            return new Promise((resolve, reject) => {
                videoStream.on('finish', async () => {
                    try {
                        // 동영상에서 오디오 추출
                        await this.extractAudio(videoPath, audioPath);
                        
                        // STT 처리
                        const transcription = await this.transcribeAudio(audioPath);
    
                        // 텍스트 요약
                        const summary = await this.summarizeText(transcription);
                        
                        // 임시 파일 삭제
                        fs.unlinkSync(videoPath);
                        fs.unlinkSync(audioPath);
    
                        resolve({  summary });
                    } catch (error) {
                        reject(new HttpException(`Processing error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR));
                    }
                });
    
                videoStream.on('error', (error) => {
                    reject(new HttpException(`Download error: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR));
                });
            });
        } catch (error) {
            console.error('Error downloading video:', error);
            throw new HttpException(`Failed to download video: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    

    private async extractAudio(videoPath: string, audioPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            ffmpeg(videoPath)
                .toFormat('wav')
                .on('end', () => {
                    console.log('Audio extraction completed');
                    resolve();
                })
                .on('error', (error) => {
                    console.error('Error extracting audio:', error);
                    reject(error);
                })
                .save(audioPath);
        });
    }

    private async transcribeAudio(audioPath: string): Promise<string> {
        try {
            const whisperApiUrl = 'http://localhost:8000/api/v1/stt';
            
            // FormData 생성
            const formData = new FormData();
            formData.append('file', fs.createReadStream(audioPath)); // 파일 스트림 추가
    
            const response = await axios.post(whisperApiUrl, formData, {
                headers: {
                    ...formData.getHeaders(),  // FormData의 헤더 추가
                    'Accept': 'application/json',
                },
            });
    
            if (response.data && response.data.transcription) {
                const transcription = response.data.transcription;
                const correctedTranscription = await this.correctSpelling(transcription);
                return correctedTranscription;
            } else {
                throw new HttpException('Transcription failed', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (error) {
            throw new HttpException(error.response?.data?.detail || 'Error during transcription', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    private async correctSpelling(text: string): Promise<string> {
        try {
            const prompt = `"${text}"너는 STT를 사용한 텍스트의 언어를 완벽하게 교정할 수 있어 단어를 교정해줘`;
            const response = await this.generateText(prompt);
    
            if (response) {
                return response;
            } else {
                throw new HttpException('Spelling correction failed', HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (error) {
            throw new HttpException(error.response?.data?.detail || 'Error during spelling correction', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    
    }
}
