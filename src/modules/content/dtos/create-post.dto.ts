import { IsString, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreatePostDto {
  @IsString()
  businessId: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsString()
  caption: string;

  @IsOptional()
  @IsBoolean()
  captionAiGenerated?: boolean;

  @IsOptional()
  @IsString()
  originalImageUrl?: string;

  @IsOptional()
  @IsArray()
  channels?: string[];
}
