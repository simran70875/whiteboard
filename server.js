const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const cors = require("cors");

// Create an Express app
const app = express();
const corsOptions = {
  origin: 'https://whiteboard-tau-eight.vercel.app/',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
// Create an HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle drawing events
  socket.on("drawing", (data) => {
    socket.broadcast.emit("drawing", data);
  });

  socket.on("pencilColor", (data) => {
    socket.broadcast.emit("pencilColor", data);
  });

  socket.on("pencilSize", (data) => {
    socket.broadcast.emit("pencilSize", data);
  });

  socket.on("eraser", (data) => {
    socket.broadcast.emit("eraser", data);
  });

  socket.on("eraserSize", (data) => {
    socket.broadcast.emit("eraserSize", data);
  });
  
  socket.on("addImage", (data) => {
    socket.broadcast.emit("addImage", data);
  });

  // Handle sticky note creation events
  socket.on("createSticky", (data) => {
    socket.broadcast.emit("createSticky", data);
  });
  socket.on("closeSticky", (data) => {
    socket.broadcast.emit("closeSticky", data);
  });

  socket.on("minimize", (data) => {
    socket.broadcast.emit("minimize", data);
  });

  socket.on("dragAndDrop", (data) => {
    socket.broadcast.emit("dragAndDrop", data);
  });

  // Handle undo events
  socket.on("undo", (data) => {
    socket.broadcast.emit("undo", data);
  });

  // Handle redo events
  socket.on("redo", (data) => {
    socket.broadcast.emit("redo", data);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
const PORT = 'https://whiteboard-five-jade.vercel.app';
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
