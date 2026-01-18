import express from "express";
import { register, login, logout, getMyProfile } from "../controller/auth.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getMyProfile);

export default router;
