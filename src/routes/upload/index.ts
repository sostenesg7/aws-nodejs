import { Router } from 'express';
import S3Storage from '../../util/S3Storage';

const router = Router();
const storage = new S3Storage();

router.get('/stream/:fileName', async (req, res) => {
  storage.getFileStream(req.params.fileName, res);
});

router.get('/url/:fileName', async (req, res) => {
  res.send(await storage.getSignedUrl(req.params.fileName));
});

export default router;