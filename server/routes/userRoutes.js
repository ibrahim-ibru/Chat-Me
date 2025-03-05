import express from "express";
import { getCurrentUser, getAllUsers } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js"; // Protect routes

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);
router.get("/users", authMiddleware, getAllUsers);

export default router;
