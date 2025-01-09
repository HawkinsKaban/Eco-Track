const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      const uploadType = req.uploadType || 'general'; // Default ke 'general'
      const dest = path.join(__dirname, '../../uploads', uploadType);

      // Buat folder jika belum ada
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
        console.log(`Directory created: ${dest}`);
      }

      cb(null, dest);
    } catch (err) {
      console.error('Error creating upload directory:', err.message);
      cb(new Error('Failed to set upload directory'), false);
    }
  },
  filename: (req, file, cb) => {
    try {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const fileExt = path.extname(file.originalname).toLowerCase(); // Pastikan ekstensi selalu lowercase
      cb(null, `${uniqueSuffix}${fileExt}`);
    } catch (err) {
      console.error('Error generating filename:', err.message);
      cb(new Error('Failed to generate file name'), false);
    }
  },
});

// Filter untuk memvalidasi jenis file
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!allowedTypes.includes(file.mimetype)) {
    console.error(`Invalid file type: ${file.mimetype}`);
    return cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
  cb(null, true);
};

// Konfigurasi Multer
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimum ukuran file: 5MB
});

// Middleware untuk menetapkan `uploadType` berdasarkan kebutuhan
const setUploadType = (uploadType) => (req, res, next) => {
  req.uploadType = uploadType;
  next();
};

module.exports = { upload, setUploadType };
