import { IsString, Length } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoDto } from './create-video.dto';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
    @IsString()
    @Length(0, 100)
    video_url: string;
}
