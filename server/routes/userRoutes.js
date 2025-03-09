// server/routes/userRoutes.js
import express from "express";
import { getCurrentUser, getAllUsers, updateUser } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js"; // Protect routes

const router = express.Router();

router.get("/me", authMiddleware, getCurrentUser);
router.get("/users", authMiddleware, getAllUsers);
router.put("/users/update", authMiddleware, updateUser);


export default router;
