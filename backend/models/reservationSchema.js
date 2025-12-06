import mongoose from "mongoose";
import validator from "validator";

const reservationSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        minLength: [3, "First name requires at least 3 character!"],
        maxLength: [30, "Fisrt name cannot exceed 30 character!"],
    },
    lastName : {
        type: String,
        required: true,
        minLength: [3, "Last name requires at least 3 character!"],
        maxLength: [30, "Last name cannot exceed 30 character!"],
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, "Provide a valid email"],
    },
    phone: {
        type: String,
        required: true,
        minLength: [11, "Number must be 11 digits!"],
        maxLength: [11, "Number cannot exceed 11 digit!"],
    },
    time: {
        type: String,
        required: true,

    },
     date: {
        type: String,
        required: true,

    },
    
});

export const Reservation = mongoose.model("Reservation", reservationSchema);