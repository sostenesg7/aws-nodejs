import { Router } from 'express';
import uploadManager from '../../util/UploadManager';
import S3Storage from '../../util/S3Storage';
import { Writable } from 'stream';
import fs from 'fs';
import multer from 'multer';

const router = Router();
const storage = new S3Storage();

router.get('/stream/:fileName', async (req, res) => {
  storage.getFileStream(req.params.fileName, res);
});

router.get('/url/:fileName', async (req, res) => {
  res.send(await storage.getSignedUrl(req.params.fileName));
});

router.post('/', uploadManager.single('file'), (req, res, next) => {
  res.send('Upload success');
});

router.post('/upload', uploadManager.single('file'), (req, res, next) => {
  const { file } = req;

  console.log(file);

  file?.stream.on('data', () => {
    console.log('data')
  });

  file?.stream.on('end', () => {
    res.send('Upload sucess.')
  });
});


export default router;
