import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId, // Stores the sender's user ID
      ref: "User", // References the "User" collection
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId, // Stores the receiver's user ID
      ref: "User", // References the "User" collection
      required: true,
    },
    text: {
      type: String, // Stores message text 
    },
    image: {
      type: String, // Stores an image URL
    },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt fields
);

// Create the Message model from the schema
const Message = mongoose.model("Message", messageSchema);

export default Message; // Export the model for use in other parts of the app
