import multer from "multer";
import path from "path";

const maxSize = 1 * 1000 * 1000; // 1MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isMimeValid = allowedTypes.test(file.mimetype);
  const isExtValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (isMimeValid && isExtValid) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG, Webp files are allowed"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: maxSize },
  fileFilter,
});

export default upload;