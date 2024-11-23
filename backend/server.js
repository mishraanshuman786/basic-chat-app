const http = require("http");
const express = require("express");
const socketIo = require("socket.io");
const upload = require("./utility/multerConfig.js");
const path = require("path");
const cors = require("cors");

// Initialize Express app
const app = express();

app.use(cors());
app.use(express.json());

// Serve static files (e.g., uploaded files)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// File upload route
app.post("/upload", upload.single("pdf"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  const filePath = `${req.file.filename}`;
  res.status(200).json({ filePath, message: "File uploaded successfully" });
});

// Define routes using Express
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

// Example route for other API endpoints
app.get("/", (req, res) => {
  res.send("Welcome to the Socket.IO Server with Express!");
});

// Create an HTTP server using the Express app
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
  cors: {
    origin: "*", // Specify your frontend origin here
    methods: ["GET", "POST"],
  },
});

const users = {};

// Handle new user connection via Socket.IO
io.on("connection", (socket) => {
  console.log(socket.id + " is connected.");

  // Event for new user joining
  socket.on("new_user_joined", (name) => {
    console.log("New User arrived: " + name);
    users[socket.id] = name;
    socket.broadcast.emit("user_joined", name);
  });

  // Event for sending message
  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log(socket.id + " disconnected.");
    socket.broadcast.emit("user_left", users[socket.id]);
    delete users[socket.id];
  });
});

// Start the server
server.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
