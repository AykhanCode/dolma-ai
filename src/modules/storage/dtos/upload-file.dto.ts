import { IsString, IsOptional } from 'class-validator';

export class UploadFileDto {
  @IsString()
  filename: string;

  @IsString()
  contentType: string;

  @IsOptional()
  @IsString()
  folder?: string;
}
