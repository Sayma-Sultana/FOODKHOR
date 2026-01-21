import express from "express";
import { sendReservation, getAllReservations, getPendingReservations, updateReservationStatus } from "../controller/reservation.js";
import { isAuthenticated } from "../middleware/auth.js";
import { isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/send", sendReservation);

// Admin routes
router.get("/admin/all", isAuthenticated, isAdmin, getAllReservations);
router.get("/admin/pending", isAuthenticated, isAdmin, getPendingReservations);
router.put("/admin/update-status/:reservationId", isAuthenticated, isAdmin, updateReservationStatus);

export default router;