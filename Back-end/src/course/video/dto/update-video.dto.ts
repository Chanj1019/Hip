import { IsString, MaxLength } from 'class-validator'
import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoDto } from './create-video.dto';

export class UpdateVideoDto extends PartialType(CreateVideoDto) {
    @IsString()
    @MaxLength(255)
    video_url: string;

    @IsString()
    @MaxLength(255)
    video_name: string;
}
