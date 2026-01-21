import express from "express";
import { createCategory, getAllCategories, updateCategory, deleteCategory } from "../controller/categoryController.js";

const router = express.Router();

router.post("/add", createCategory);
router.get("/getall", getAllCategories);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
