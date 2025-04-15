const User = require("../models/user");
const jwtUtil = require("../utils/JwtUtils");

module.exports = async (req, res, next) => {
  try {
    
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token missing" });
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Invalid token format" });
    }


    const decoded = await jwtUtil.verify(token);
    
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT Middleware Error:", err.message);
    return res.status(500).json({ message: "Authentication failed" });
  }
};
