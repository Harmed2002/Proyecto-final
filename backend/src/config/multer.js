import multer from 'multer';
import { __dirname } from '../path.js';
// import path from 'path';

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'src/public/img'); // null hace referencia a q no envía errores
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}${file.originalname}`);
	},
});

const upload = multer({ storage: storage });

export default upload;