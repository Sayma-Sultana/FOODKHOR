// import { json } from "express";
import ErrorHandler from "../error/error.js";
import { Reservation } from "../models/reservationSchema.js";

export const sendReservation = async (req, res, next) => {
    const { firstName, lastName, email, date, time, phone } = req.body;
    if( !firstName || !lastName || !email || !date || !time || !phone ) {
        return next(new ErrorHandler("Please fill full reservation form!", 400));
    }

    try {
        await Reservation.create({firstName, lastName, email, date, time, phone});
        res.status(201).json({
            success: true,
            message: "Reservation sent successfully!",
        });
    } catch (error) {
        if(error.name === 'ValidationError'){
            const ValidationErrors = Object.values(error.errors).map(err => err.message);
            return next(new ErrorHandler(ValidationErrors.join(' , '), 400));
        }
        return next(error);
    }
};

export const getAllReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.find().sort({ reservationDate: -1 });
        res.status(200).json({
            success: true,
            reservations,
        });
    } catch (error) {
        return next(error);
    }
};

export const getPendingReservations = async (req, res, next) => {
    try {
        const reservations = await Reservation.find({ status: "pending" }).sort({ reservationDate: -1 });
        res.status(200).json({
            success: true,
            reservations,
        });
    } catch (error) {
        return next(error);
    }
};

export const updateReservationStatus = async (req, res, next) => {
    try {
        const { reservationId } = req.params;
        const { status } = req.body;

        if (!["confirmed", "cancelled", "completed"].includes(status)) {
            return next(
                new ErrorHandler("Invalid status! Status must be: confirmed, cancelled, or completed", 400)
            );
        }

        const reservation = await Reservation.findByIdAndUpdate(
            reservationId,
            { status },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!reservation) {
            return next(new ErrorHandler("Reservation not found!", 404));
        }

        res.status(200).json({
            success: true,
            message: `Reservation status updated to ${status}`,
            reservation,
        });
    } catch (error) {
        return next(error);
    }
};