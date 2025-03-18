import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body; // Extract data from request body

  try {

    if(!fullName || !email || !password) {
         return res
           .status(400)
           .json({ message: "All fields are required" });
    }
    // Check if password is at least 6 characters long
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if the user already exists in the database
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    // Hash the password
    const salt = await bcrypt.genSalt(10); // Generate salt for hashing
    const hashedPassword = await bcrypt.hash(password, salt); // Hash the password

    // Create a new user instance
    const newUser = new User({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });

    if (newUser) {
      // Generate JWT token and set it in cookies
      generateToken(newUser._id, res);

      // Save the new user to the database
      await newUser.save();

      // Send a response with user details (excluding password)
      res.status(201).json({
        _id: newUser._id, // User ID
        fullName: newUser.fullName, // User's full name
        email: newUser.email, // User's email
        profilePic: newUser.profilePic, // User's profile picture (if available)
      });
    } else {
      // Send error response if user creation fails
      res.status(400).json({ message: "Invalid user data" });
    }

  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ message: "Server error" }); // Handle errors
  }
};


export const login = (req,res) => {
    res.send("login route");
};

export const logout = (req,res) => {
    res.send("logout route");
};