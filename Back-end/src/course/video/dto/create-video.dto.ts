import { IsString, MaxLength } from 'class-validator'

export class CreateVideoDto {
    @IsString()
    @MaxLength(255)
    video_url: string;

    @IsString()
    @MaxLength(255)
    video_name: string;
}