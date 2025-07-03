// backend/middleware/uploadMiddleware.js

const multer = require('multer');
const path = require('path');

// This function configures how files will be stored on the server's disk.
const storage = multer.diskStorage({
    // The destination folder for our uploads
    destination: './private_uploads/',
    // The function to generate a unique filename for each uploaded file
    filename: function (req, file, cb) {
        // We combine the original fieldname, the current timestamp, and the original file extension
        // This ensures every filename is unique. e.g., 'image-1751302800000.jpg'
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// This function checks if the uploaded file is a valid image type.
// This is a critical security step to prevent uploading malicious files.
function checkFileType(file, cb) {
    // Define the allowed file extensions
    const filetypes = /jpeg|jpg|png|gif/;
    // Check the file's extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check the file's MIME type (its actual format)
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        // If both checks pass, allow the file
        return cb(null, true);
    } else {
        // If it's not a valid image, reject it with an error message
        cb('Error: You can only upload image files!');
    }
}

// Initialize the main multer upload object with our configuration
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Set a file size limit of 2MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Export the configured upload middleware
module.exports = upload;