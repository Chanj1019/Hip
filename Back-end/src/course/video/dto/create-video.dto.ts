import { IsString, Length } from 'class-validator'

export class CreateVideoDto {
    @IsString()
    @Length(0, 100)
    video_title: string;
}