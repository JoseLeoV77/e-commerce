import multer from 'multer'

const FILE_AMOUNT_LIMIT = 5
const FILE_MB_LIMIT = 5 * 1024 * 1024 // 5 MB

const storage = multer.memoryStorage(); // Use memory storage for Supabase upload

const upload = multer({
  storage: storage,
  limits: {
    fileSize: FILE_MB_LIMIT,
    files: FILE_AMOUNT_LIMIT
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  }
})

export default upload