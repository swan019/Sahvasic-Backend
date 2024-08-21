const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'roommate-finder',
        allowed_formats: ['jpg', 'png'],
    },
});

// Middleware function to handle variable number of files
const upload = (req, res, next) => {
    const maxFiles = parseInt(req.body.maxFiles) || 3; // Default to 3 if not specified
    console.log(maxFiles);
    console.log(req.body);
    
    
    const multerUpload = multer({ storage: storage }).array('images', maxFiles);

    multerUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(500).json({ error: 'An error occurred while uploading files' });
        }
        next();
    });
};

module.exports = upload;
