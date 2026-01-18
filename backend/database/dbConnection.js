import mongoose from "mongoose";

export const dbConnection = () => {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Connected to database successfully!");
        })
        .catch((err) => {
            console.log(`Database connection error: ${err.message}`);
            console.log("Please check your MONGO_URI in config.env");
        });
};
