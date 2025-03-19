import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // Get the logged-in user's ID

    // Fetch users except the logged-in user & exclude password field
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers); // Return users list
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" }); // Handle errors
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // Get the ID of the user to chat with from the request params
    const myId = req.user._id; // Get the logged-in user's ID

    // Find messages where the logged-in user is either the sender or receiver
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId }, // Messages sent by logged-in user
        { senderId: userToChatId, receiverId: myId }, // Messages received by logged-in user
      ],
    });

    res.status(200).json(messages); // Return the messages
  } catch (error) {
    console.log("Error in getMessages controller:", error.message);
    res.status(500).json({ error: "Internal server error" }); // Handle errors
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body; // Get text and image from request body
    const { id: receiverId } = req.params; // Get the receiver's user ID from request parameters
    const senderId = req.user._id; // Get the logged-in user's ID

    let imageUrl;
    if (image) {
      // Upload base64 image to Cloudinary and get the secure URL
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // Create a new message document
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl, // Save the uploaded image URL if available
    });

    await newMessage.save(); // Save the message in the database

    res.status(201).json(newMessage); // Return the saved message
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" }); // Handle errors
  }
};

