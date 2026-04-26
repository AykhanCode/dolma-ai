import { IsString } from 'class-validator';

export class SchedulePostDto {
  @IsString()
  scheduledTime: string;
}
