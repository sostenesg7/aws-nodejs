import S3, { GetObjectOutput } from 'aws-sdk/clients/s3';
import mime from 'mime';
import fs from 'fs/promises';
import path from 'path';
import { AWS_ACL } from './constants';
import { v4 as uuidv4 } from 'uuid';
import { Response } from 'express';
import { PutObjectCommand } from '@aws-sdk/client-s3';

// https://github.com/aws/aws-sdk-js-v3#getting-started
class S3Storage {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: 'us-east-1',
    });
  }

  async saveFile(fileName: string): Promise<void> {
    const filePath = path.join('tmp', fileName);
    const contentType = mime.getType(filePath) as string;

    try {
      const file = await fs.readFile(filePath);
      const result = await this.client.putObject({
        Bucket: String(process.env.AWS_BUCKET_NAME),
        Key: `${uuidv4()}_${fileName}`,
        ContentType: contentType,
        ACL: AWS_ACL.PRIVATE,
        Body: file,
      }).promise();
      console.log(result.$response.data);
      // fs.unlink()
    } catch (error) {
      console.error(error);
    }
  }

  async getFileStream(fileName: string, res: Response): Promise<void | undefined> {
    try {
      const readStream = await this.client.getObject({
        Bucket: String(process.env.AWS_BUCKET_NAME),
        Key: fileName,
      }).createReadStream();
      readStream.pipe(res);

    } catch (error) {
      console.error(error);
    }
  }

  async getSignedUrl(fileName: string): Promise<string | undefined> {
    try {
      const expiresIn = new Date();
      expiresIn.setMinutes(expiresIn.getMinutes() + 1);
      const signedUrl = await this.client.getSignedUrl('getObject', {
        Bucket: String(process.env.AWS_BUCKET_NAME),
        Key: fileName,
        ResponseExpires: expiresIn,
      });
      return signedUrl;
    } catch (error) {
      console.error(error);
    }
  }

}

export default S3Storage;
