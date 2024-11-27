import { IsString } from 'class-validator'


export class videoSummary {
    @IsString()
    summary: string;
}
