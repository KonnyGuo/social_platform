const multer = require("multer");
const path = require("path");

// Require the multer and path modules. Multer will handle uploading files and path helps with managing file paths.
// Export a configured multer instance that will handle file uploads.
// Set storage to diskStorage which will store files on the local filesystem.
// Configure the fileFilter function to check the file type before uploading.
// Get the file extension using path.extname() and check if it's a supported image type (.jpg, .jpeg, .png).
// If the file type is unsupported, return an error via the callback cb() which will reject that file.
// If the file type is supported, call the callback cb() with null error and true to accept the file.
// This filter prevents non-image files from being uploaded.
// The configured multer middleware can now be used in Express routes to handle file uploads, filtering to only allow images.
// The uploaded files will be stored locally in the default directory. Additional options can configure file storage further.

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      cb(new Error("File type is not supported"), false);
      return;
    }
    cb(null, true);
  },
});
