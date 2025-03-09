


//  /server/controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
dotenv.config();

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    console.log("haix");
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

