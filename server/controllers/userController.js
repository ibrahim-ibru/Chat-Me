// server/controllers/userController.js
import User from "../models/User.js";
export const getCurrentUser = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find()//.select("-password");
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  export const updateUser = async (req, res) => {
    try {
      const { username, email } = req.body;
      
      // Find user by ID (from auth token)
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: "User not found" });
      
      // Update fields
      if (username) user.username = username;
      if (email) user.email = email;
      
      await user.save();
      
      // Return updated user without password
      const updatedUser = await User.findById(req.user.id).select("-password");
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  