// external package
const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

function uploader(
  subfolder_path,
  allowed_file_types,
  max_file_size,
  error_msg
) {
  // upload folder path

  const UPLOAD_FOLDER = `${__dirname}/../public/uploads/${subfolder_path}`;

  // define storage
  const storage = multer.diskStorage({
    destination: (req, res, cb) => {
      cb(null, UPLOAD_FOLDER);
    },

    filename: (req, file, cb) => {
      const FileExt = path.extname(file.originalname);
      const filename =
        file.originalname
          .replace(FileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();

      cb(null, filename + FileExt);
    },
  });

  // prepare the final multer object
  const upload = multer({
    storage: storage,
    limits: {
      fieldSize: max_file_size,
    },
    fileFilter: (req, file, cb) => {
      if (allowed_file_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(createError(error_msg));
      }
    },
  });

  // make upload object
  return upload;
}

module.exports = uploader;
