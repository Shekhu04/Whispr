import React, { useEffect, useRef } from "react"; // Import React, useEffect for side effects, and useRef for references
import { useChatStore } from "../store/useChatStore"; // Import custom chat store for chat state management
import { useAuthStore } from "../store/useAuthStore"; // Import auth store to get the current user
import ChatHeader from "./ChatHeader"; // Import ChatHeader component
import MessageInput from "./MessageInput"; // Import MessageInput component
import MessageSkeleton from "./skeletons/MessageSkeleton"; // Import MessageSkeleton for loading state
import { formatMessageTime } from "../lib/utils"; // Import utility function to format message timestamps

const ChatContainer = () => {
  // Extract chat-related state and functions from chat store
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  // Extract authenticated user data from auth store
  const { authUser } = useAuthStore();

  // Create a reference for tracking the end of the message list
  const messageEndRef = useRef(null);

  // Fetch messages when the selected user changes
  useEffect(() => {
    getMessages(selectedUser._id); // Call the function to fetch messages
    subscribeToMessages(); // Subscribe to new messages

    return () => {
      unsubscribeFromMessages();
    }; // Unsubscribe from messages when component unmounts
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]); // Re-run when selectedUser._id or getMessages changes

  useEffect(() => {
    // Check if the messageEndRef is set and messages exist
    if (messageEndRef.current && messages) {
      // Scroll to the latest message smoothly when messages change
      messageEndRef.current.scrollIntoView({ behaviour: "smooth" });
    }
  }, [messages]); // Run this effect whenever the messages array updates

  // If messages are loading, show skeleton loader
  if (isMessagesLoading)
    return (
      <div>
        <ChatHeader /> {/* Show chat header while loading */}
        <MessageSkeleton /> {/* Show skeleton loader for messages */}
        <MessageInput /> {/* Show input field even when loading */}
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader /> {/* Display chat header */}
      {/* Messages container with scrollable area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Loop through messages and display each message */}
        {messages.map((message) => (
          <div
            key={message._id} // Unique key for each message
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`} // Align messages to the right if sent by the logged-in user, otherwise align left
            ref={messageEndRef} // Reference to the last message
          >
            {/* Profile picture of the message sender */}
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png" // Use authUser's profile pic if sender is the logged-in user
                      : selectedUser.profilePic || "/avatar.png" // Otherwise, use the selected user's profile pic
                  }
                  alt="profile pic" // Alternative text for accessibility
                />
              </div>
            </div>

            {/* Message timestamp */}
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)} {/* Format timestamp */}
              </time>
            </div>

            {/* Message bubble (contains text and/or image) */}
            <div className="chat-bubble flex flex-col">
              {/* If the message has an image, display it */}
              {message.image && (
                <img
                  src={message.image} // Display attached image
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2" // Limit size and add styles
                />
              )}

              {/* If the message has text, display it */}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      {/* Message input field for sending new messages */}
      <MessageInput />
    </div>
  );
};

export default ChatContainer; // Export the component
