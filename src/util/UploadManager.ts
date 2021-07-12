import multer from 'multer';

const uploadManager = multer({
  dest: 'tmp',
  limits: {
    fileSize: 1024 * 100, //100kb
  }
});

export default uploadManager;
