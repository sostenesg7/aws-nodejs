import multer from 'multer';

const uploadManager = multer({
  // dest: 'tmp',
  limits: {
    fileSize: 1024 * 100, //100kb
  },
  storage: {
    _handleFile: (req, file, callback) => {

    },
    _removeFile: (req, file, callback) => {

    }
  }
});

export default uploadManager;
