import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.get('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: configService.get('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY', ''),
      },
    });
    this.bucket = configService.get('AWS_S3_BUCKET', 'dolma-ai-storage');
  }

  async uploadFile(
    buffer: Buffer,
    originalName: string,
    contentType: string,
    folder = 'uploads',
  ): Promise<{ url: string; key: string }> {
    const ext = originalName.split('.').pop();
    const key = `${folder}/${uuidv4()}.${ext}`;

    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      }),
    );

    const url = `https://${this.bucket}.s3.amazonaws.com/${key}`;
    return { url, key };
  }

  async deleteFile(key: string): Promise<void> {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });
    return getSignedUrl(this.s3Client, command, { expiresIn });
  }
}
