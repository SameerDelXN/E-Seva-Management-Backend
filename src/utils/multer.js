import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';

// Configure Multer to use Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'agents', // Cloudinary folder name
    format: async (req, file) => 'png', // Convert all images to PNG
    public_id: (req, file) => `${req.body.shopName}_${file.fieldname}_${Date.now()}`, // Rename file
  },
});

const upload = multer({ storage });

export default upload;
