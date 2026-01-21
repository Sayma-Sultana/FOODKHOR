import { Category } from "../models/categorySchema.js";
import ErrorHandler from "../error/error.js";

export const createCategory = async (req, res, next) => {
    try {
        const { title } = req.body;
        if (!title) {
            return next(new ErrorHandler("Please provide a category title", 400));
        }
        const category = await Category.create({ title });
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            category,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            categories,
        });
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        let category = await Category.findById(id);
        if (!category) {
            return next(new ErrorHandler("Category not found", 404));
        }
        category = await Category.findByIdAndUpdate(id, { title }, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            category,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        let category = await Category.findById(id);
        if (!category) {
            return next(new ErrorHandler("Category not found", 404));
        }
        await category.deleteOne();
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
