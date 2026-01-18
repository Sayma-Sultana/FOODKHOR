import express from "express";
import {
    createOrder,
    getMyOrders,
    getAllOrders,
    getPendingOrders,
    updateOrderStatus,
    getOrderById,
} from "../controller/order.js";
import { isAuthenticated } from "../middleware/auth.js";
import { isAdmin } from "../middleware/auth.js";

const router = express.Router();

// Customer routes
router.post("/create", isAuthenticated, createOrder);
router.get("/my-orders", isAuthenticated, getMyOrders);
router.get("/:orderId", isAuthenticated, getOrderById);

// Admin routes
router.get("/admin/all", isAuthenticated, isAdmin, getAllOrders);
router.get("/admin/pending", isAuthenticated, isAdmin, getPendingOrders);
router.put("/admin/update-status/:orderId", isAuthenticated, isAdmin, updateOrderStatus);

export default router;
