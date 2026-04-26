import { IsOptional } from 'class-validator';

export class DeployAgentDto {
  @IsOptional()
  channelCredentials?: any;
}
