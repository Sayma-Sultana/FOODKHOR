import jwt from "jsonwebtoken";
import ErrorHandler from "../error/error.js";
import { User } from "../models/userSchema.js";

export const isAuthenticated = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("User not authenticated!", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid token!", 401));
    }
};

export const isAdmin = async (req, res, next) => {
    if (req.user.role !== "admin") {
        return next(new ErrorHandler("Admin only! Access denied.", 403));
    }
    next();
};
