import { config } from 'dotenv';
import S3Storage from './util/S3Storage';
import express from 'express';
import upload from './routes/upload';
const app = express();
config();
const storage = new S3Storage();

app.use('/file', upload);
app.get('/test', (req, res) => {
  res.send('ok')
})

// storage.saveFile('image.png');

app.listen(3000, () => console.log('SERVER STARTED AT PORT 3000'));
