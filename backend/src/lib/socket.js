import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"]
    }
})

export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}
// This object will store the mapping between user IDs and their corresponding socket IDs.
const userSocketMap = {};

// Listen for incoming socket connections
io.on("connection", (socket) => {
    console.log("A user connected", socket.id); // Log the socket ID of the newly connected user

    // Extract the user ID from the handshake query (sent when the user connects)
    const userId = socket.handshake.query.userId;

    // If a valid userId exists, map it to the socket ID
    if (userId) userSocketMap[userId] = socket.id;

    // Emit the updated list of online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Listen for the "disconnect" event, which triggers when a user disconnects
    socket.on("disconnect", () => {
        console.log("A user disconnected", socket.id); // Log the disconnected socket ID

        // Remove the user from the userSocketMap since they are no longer online
        delete userSocketMap[userId];

        // Emit the updated list of online users to all connected clients
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});


export {io, app, server};