const { validationResult } = require('express-validator');

/**
 * Middleware untuk validasi request
 * @param {Array} validations - Array dari express-validator middlewares
 * @returns {Function} Middleware express
 */
const validateRequest = (validations) => {
  return async (req, res, next) => {
    try {
      // Jalankan semua validasi secara paralel
      await Promise.all(validations.map((validation) => validation.run(req)));

      // Ambil hasil validasi
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Kirim response error jika validasi gagal
        return res.status(400).json({
          success: false,
          errors: errors.array().map((err) => ({
            field: err.param,
            message: err.msg,
            location: err.location, // Tambahan informasi lokasi (body, query, params, dll)
          })),
        });
      }

      // Lanjutkan ke middleware berikutnya jika tidak ada error
      next();
    } catch (error) {
      console.error('Validation Middleware Error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
      });
    }
  };
};

module.exports = validateRequest;
