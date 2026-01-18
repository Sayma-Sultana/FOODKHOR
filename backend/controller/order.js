import ErrorHandler from "../error/error.js";
import { Order } from "../models/orderSchema.js";

export const createOrder = async (req, res, next) => {
    try {
        const { items, shippingAddress } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return next(new ErrorHandler("Cart is empty! Please add items to cart.", 400));
        }

        if (!shippingAddress || !shippingAddress.street || !shippingAddress.city || !shippingAddress.phone) {
            return next(new ErrorHandler("Please provide complete shipping address!", 400));
        }

        // Calculate total amount
        const totalAmount = items.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        const order = await Order.create({
            user: req.user.id,
            items,
            totalAmount,
            shippingAddress,
        });

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            order,
        });
    } catch (error) {
        return next(error);
    }
};

export const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ orderDate: -1 });
        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        return next(error);
    }
};

export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate("user", "firstName lastName email phone")
            .sort({ orderDate: -1 });
        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        return next(error);
    }
};

export const getPendingOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ status: "pending" })
            .populate("user", "firstName lastName email phone")
            .sort({ orderDate: -1 });
        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        return next(error);
    }
};

export const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!["delivered", "returned", "out_of_ingredients"].includes(status)) {
            return next(
                new ErrorHandler("Invalid status! Status must be: delivered, returned, or out_of_ingredients", 400)
            );
        }

        const updateData = { status };
        if (status === "delivered") {
            updateData.deliveredDate = new Date();
        }

        const order = await Order.findByIdAndUpdate(orderId, updateData, {
            new: true,
            runValidators: true,
        }).populate("user", "firstName lastName email phone");

        if (!order) {
            return next(new ErrorHandler("Order not found!", 404));
        }

        res.status(200).json({
            success: true,
            message: `Order status updated to ${status}`,
            order,
        });
    } catch (error) {
        return next(error);
    }
};

export const getOrderById = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate("user", "firstName lastName email phone");

        if (!order) {
            return next(new ErrorHandler("Order not found!", 404));
        }

        // Check if user owns the order or is admin
        if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
            return next(new ErrorHandler("Access denied!", 403));
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        return next(error);
    }
};
