import { config } from 'dotenv';
config();
import S3Storage from './util/S3Storage';

const storage = new S3Storage();

storage.saveFile('image.png');
