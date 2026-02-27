import multer from "multer";
import path from "path";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "./public/temp"));
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname.split(".")[0]}.${file.originalname.split(".")[1]}`);
    }
});
const upload = multer({ storage: storage });
export default upload;
 
//cb-callback function