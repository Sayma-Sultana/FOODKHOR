import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    dishId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "delivered", "returned", "out_of_ingredients"],
        default: "pending",
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        phone: { type: String, required: true },
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
    deliveredDate: {
        type: Date,
    },
});

export const Order = mongoose.model("Order", orderSchema);
