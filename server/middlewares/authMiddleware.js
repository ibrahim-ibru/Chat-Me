// server/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  
  const token = req.header("Authorization");
  console.log("hai");
  if (!token) return res.status(401).json({ error: "token Access denied" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};

export default authMiddleware;

