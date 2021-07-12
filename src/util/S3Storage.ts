import S3, { GetObjectOutput } from 'aws-sdk/clients/s3';
import mime from 'mime';
import fs from 'fs/promises';
import path from 'path';
import { AWS_ACL } from './constants';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import {
  S3Client,
  S3ClientConfig,
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandInput,
  SelectObjectContentEventStream,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
class S3Storage {
  private client: S3Client;

  constructor() {
    const config: S3ClientConfig = {
      region: 'us-east-1',
    };

    this.client = new S3Client(config);
  }

  async saveFile(fileName: string): Promise<string | undefined> {
    const filePath = path.join('tmp', fileName);
    const contentType = mime.getType(filePath) as string;
    const fileKey = `${uuidv4()}_${fileName}`;
    try {
      const file = await fs.readFile(filePath);
      const input: PutObjectCommandInput = {
        Bucket: String(process.env.AWS_BUCKET_NAME),
        Key: fileKey,
        ContentType: contentType,
        ACL: AWS_ACL.PRIVATE,
        Body: file,
      };
      const command = new PutObjectCommand(input);
      await this.client.send(command);
      return this.getSignedUrl(fileKey);
      // fs.unlink()
    } catch (error) {
      console.error(error);
    }
  }

  async getFileStream(fileKey: string, res: Response): Promise<void> {
    const input: GetObjectCommandInput = {
      Bucket: String(process.env.AWS_BUCKET_NAME),
      Key: fileKey,
    };
    const command = new GetObjectCommand(input);
    const readable = (await this.client.send(command)).Body as Readable;
    readable.pipe(res);
  }

  async getSignedUrl(fileKey: string): Promise<string | undefined> {
    const input: GetObjectCommandInput = {
      Bucket: String(process.env.AWS_BUCKET_NAME),
      Key: fileKey,
    };
    const command = new GetObjectCommand(input);
    const signedUrl = await getSignedUrl(
      this.client,
      command,
      { expiresIn: 60 }
    );
    return signedUrl;
  }

}

export default S3Storage;
