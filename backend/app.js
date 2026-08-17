import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { dbConnection } from "./database/dbConnection.js";
import { errorMiddleware } from "./error/error.js";
import reservationRouter from "./routes/reservationRoute.js";
import authRouter from "./routes/authRoute.js";
import orderRouter from "./routes/orderRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import dishRouter from "./routes/dishRoute.js";

const app = express();
dotenv.config({ path: "./config/config.env" });

app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));

app.options(/.*/, cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('./uploads'));
app.use("/api/v1/reservation", reservationRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/dish", dishRouter);

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

dbConnection();

app.use(errorMiddleware)

export default app;