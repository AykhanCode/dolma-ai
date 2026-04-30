import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class UpdatePostDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsBoolean()
  captionAiGenerated?: boolean;

  @IsOptional()
  @IsString()
  originalImageUrl?: string;

  @IsOptional()
  @IsArray()
  channels?: string[];

  @IsOptional()
  @IsString()
  status?: string;
}
