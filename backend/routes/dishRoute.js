import express from "express";
import { createDish, getAllDishes, updateDish, deleteDish } from "../controller/dishController.js";
import multer from "multer";
import path from "path";

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post("/add", upload.single('image'), createDish);
router.get("/getall", getAllDishes);
router.put("/update/:id", upload.single('image'), updateDish);
router.delete("/delete/:id", deleteDish);

export default router;
