import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";

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


export const login = async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  try {
    // Find user in the database by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" }); // If user not found, return error
    }

    // Compare entered password with hashed password stored in the database
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" }); // If password is incorrect, return error
    }

    // Generate JWT token and set it in cookies
    generateToken(user._id, res);

    // Send user details in response (excluding password)
    res.status(200).json({
      _id: user._id, // User ID
      fullName: user.fullName, // User's full name
      email: user.email, // User's email
      profilePic: user.profilePic, // User's profile picture (if available)
    });
  } catch (error) {
    console.log("Error in login controller", error.message); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error" }); // Return server error response
  }
};

// bcrypt.compare() is a method from the bcrypt.js library used to compare a plain text password with a hashed password stored in the database. It helps verify if a user’s entered password is correct during login.

// Syntax:
// bcrypt.compare(plainTextPassword, hashedPassword)
// Parameters:
// plainTextPassword → The password entered by the user.
// hashedPassword → The hashed password stored in the database.
// It returns a Promise that resolves to true (if the passwords match) or false (if they don’t).


export const logout = async (req, res) => {
  try {
    // Clear the JWT token by setting an empty cookie with maxAge 0
    res.cookie("jwt", "", { maxAge: 0 });

    // Send success response
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message); // Log error for debugging
    res.status(500).json({ message: "Internal server error" }); // Return server error response
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body; // Get profile picture URL/base64
    const userId = req.user._id; // Get user ID from authenticated user

    // Validate input
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    // Update user profile with the new image URL
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true } // Return updated user
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    // Respond with the authenticated user's data
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
