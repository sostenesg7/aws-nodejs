import S3 from 'aws-sdk/clients/s3';
import mime from 'mime';
import fs from 'fs/promises';
import path from 'path';
import { AWS_ACL } from './constants';
import { v5 as uuidv5 } from 'uuid';

class S3Storage {
  private client: S3;

  constructor() {
    this.client = new S3({
      region: 'us-east-1',
    });
  }

  async saveFile(filename: string): Promise<void> {
    const filePath = path.join('tmp', filename);
    const contentType = mime.getType(filePath) as string;

    try {
      const file = await fs.readFile(filePath);
      const result = await this.client.putObject({
        Bucket: String(process.env.AWS_BUCKET_NAME),
        Key: `${uuidv5(filename, uuidv5.URL)}_${filename}`,
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
}

export default S3Storage;
