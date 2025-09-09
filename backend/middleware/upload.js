import multer from "multer";

const storage = multer.memoryStorage(); // guarda en memoria para mandar a cloudinary
const upload = multer({ storage });

export default upload;
