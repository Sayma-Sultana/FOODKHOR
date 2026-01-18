import ErrorHandler from "../error/error.js";
import { User } from "../models/userSchema.js";
import { sendCookie } from "../utils/features.js";

export const register = async (req, res, next) => {
    const { firstName, lastName, email, phone, password, role } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
        return next(new ErrorHandler("Please fill full form!", 400));
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new ErrorHandler("User already exists!", 400));
        }

        // Only allow admin role if explicitly set (for admin registration)
        const userRole = role === "admin" ? "admin" : "customer";

        const user = await User.create({
            firstName,
            lastName,
            email,
            phone,
            password,
            role: userRole,
        });

        sendCookie(user, res, "Registered successfully!", 201);
    } catch (error) {
        if (error.name === "ValidationError") {
            const validationErrors = Object.values(error.errors).map(
                (err) => err.message
            );
            return next(new ErrorHandler(validationErrors.join(", "), 400));
        }
        return next(error);
    }
};

export const login = async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please provide email and password!", 400));
    }

    try {
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return next(new ErrorHandler("Invalid email or password!", 400));
        }

        // Check role if specified (for admin login)
        if (role && user.role !== role) {
            return next(new ErrorHandler("Access denied! Invalid role.", 403));
        }

        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler("Invalid email or password!", 400));
        }

        sendCookie(user, res, `Welcome back, ${user.firstName}!`, 200);
    } catch (error) {
        return next(error);
    }
};

export const logout = async (req, res, next) => {
    res.status(200)
        .cookie("token", "", {
            expires: new Date(Date.now()),
            sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
            secure: process.env.NODE_ENV === "Development" ? false : true,
        })
        .json({
            success: true,
            message: "Logged out successfully!",
        });
};

export const getMyProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(error);
    }
};
