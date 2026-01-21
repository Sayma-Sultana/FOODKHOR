import { Dish } from "../models/dishSchema.js";
import ErrorHandler from "../error/error.js";

export const createDish = async (req, res, next) => {
    try {
        const { title, category, price, description } = req.body;

        if (!title || !category || !price || !description) {
            return next(new ErrorHandler("Please provide all dish details", 400));
        }

        let image = '';
        if (req.file) {
            const protocol = req.protocol;
            const host = req.get('host');
            image = `${protocol}://${host}/uploads/${req.file.filename}`;
        } else {
            return next(new ErrorHandler("Please provide a dish image", 400));
        }

        const dish = await Dish.create({ title, category, price, image, description });
        res.status(201).json({
            success: true,
            message: "Dish created successfully",
            dish,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllDishes = async (req, res, next) => {
    try {
        const dishes = await Dish.find();
        res.status(200).json({
            success: true,
            dishes,
        });
    } catch (error) {
        next(error);
    }
};

export const updateDish = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, category, price, description } = req.body;
        let dish = await Dish.findById(id);
        if (!dish) {
            return next(new ErrorHandler("Dish not found", 404));
        }

        let image = dish.image;
        if (req.file) {
            const protocol = req.protocol;
            const host = req.get('host');
            image = `${protocol}://${host}/uploads/${req.file.filename}`;
        }

        const data = { title, category, price, image, description };
        // Filter out undefined fields to avoid overwriting with null
        Object.keys(data).forEach(key => data[key] === undefined && delete data[key]);

        dish = await Dish.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });
        res.status(200).json({
            success: true,
            message: "Dish updated successfully",
            dish,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteDish = async (req, res, next) => {
    try {
        const { id } = req.params;
        let dish = await Dish.findById(id);
        if (!dish) {
            return next(new ErrorHandler("Dish not found", 404));
        }
        await dish.deleteOne();
        res.status(200).json({
            success: true,
            message: "Dish deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
