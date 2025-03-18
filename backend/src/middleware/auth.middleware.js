import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // Get JWT token from cookies
    const token = req.cookies.jwt;

    // If no token is provided, deny access
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token verification fails, deny access
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    // Find the user in the database (excluding the password)
    const user = await User.findById(decoded.userId).select("-password");

    // If user is not found, return an error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user details to request object for further access
    req.user = user;

    // Proceed to the next middleware or controller
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// jwt.verify() is a method from the jsonwebtoken (JWT) library that is used to decode and validate a JWT (JSON Web Token). It checks whether the token is valid and has not been tampered with.

// Syntax:
// jwt.verify(token, secretKey, [options], [callback])
// Parameters:
// token → The JWT token that needs to be verified.
// secretKey → The secret key used to sign the token (process.env.JWT_SECRET).
// options (optional) → Can set expiration time checks, algorithms, etc.
// callback (optional) → Can use a callback instead of try-catch.