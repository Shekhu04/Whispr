import { useRef, useState } from "react"; // Import React hooks for state and references
import { useChatStore } from "../store/useChatStore"; // Import custom chat store for sending messages
import { Image, Send, X } from "lucide-react"; // Import icons for UI elements
import toast from "react-hot-toast"; // Import toast notifications for user feedback

// MessageInput Component
const MessageInput = () => {
  // State to hold text input
  const [text, setText] = useState("");

  // State to store selected image preview
  const [imagePreview, setImagePreview] = useState(null);

  // Reference for the hidden file input element
  const fileInputRef = useRef(null);

  // Extract sendMessage function from the chat store
  const { sendMessage } = useChatStore();

  // Handle image selection from file input
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file

    // Check if the selected file is an image
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file"); // Show error if not an image
      return;
    }

    // Read the image file as a data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Set image preview once loaded
    };
    reader.readAsDataURL(file); // Convert image to base64 format
  };

  // Remove the selected image
  const removeImage = () => {
    setImagePreview(null); // Clear the preview state
    if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
  };

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Ensure either text or an image is provided before sending
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(), // Send trimmed message text
        image: imagePreview, // Send selected image (if any)
      });

      // Clear input fields after sending message
      setText(""); // Reset text input
      setImagePreview(null); // Clear image preview
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
    } catch (error) {
      console.error("Failed to send message:", error); // Log any errors
    }
  };

  return (
    <div className="p-4 w-full">
      {" "}
      {/* Container with padding and full width */}
      {/* Image preview section (Only visible if an image is selected) */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview} // Display the preview image
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            {/* Button to remove the selected image */}
            <button
              onClick={removeImage} // Calls removeImage function
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" /> {/* Close (X) icon */}
            </button>
          </div>
        </div>
      )}
      {/* Message input form */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {/* Text input for message */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text} // Bind value to state
            onChange={(e) => setText(e.target.value)} // Update state on change
          />

          {/* Hidden file input for selecting images */}
          <input
            type="file"
            accept="image/*" // Accept only image files
            className="hidden"
            ref={fileInputRef} // Reference to trigger file picker
            onChange={handleImageChange} // Call handleImageChange on selection
          />

          {/* Button to trigger file selection */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-emerald-500" : "text-zinc-400"
            }`}
            onClick={() => fileInputRef.current?.click()} // Trigger file picker
          >
            <Image size={20} /> {/* Image icon */}
          </button>
        </div>

        {/* Send message button */}
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview} // Disable if no input
        >
          <Send size={22} /> {/* Send icon */}
        </button>
      </form>
    </div>
  );
};

export default MessageInput; // Export the component
