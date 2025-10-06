if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}
const express = require('express');
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");
const { testConnection } = require('./src/config/database');
const { syncDatabase } = require('./src/models');
const usersRoute = require("./src/routes/users.js");
const notesRoute = require("./src/routes/notes.js");


const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
app.use(express.urlencoded({ extended: true }));
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

testConnection();
syncDatabase();

// Routes
app.use("/users",usersRoute);
app.use("/notes", notesRoute);


// WebSocket connection
io.on("connection", (socket) => {
  console.log("A client connected:", socket.id);

  // Custom event: client can join a room
  socket.on("joinRoom", (roomName) => {
    socket.join(roomName);
    console.log(`${socket.id} joined room ${roomName}`);
  });

  //broadcast new note to all clients
  socket.on("newNote", (noteData) => {
    console.log("New note received via WS:", noteData);
    io.emit("noteCreated", noteData); // broadcast to all clients
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});


// heck endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: 'The requested resource does not exist'
  });
});

//this is the error handler
app.use((err, req, res, next) => {
    const {status = 501, message, stack} = err;

    if(process.env.NODE_ENV !== "production"){
        res.status(status).send(message + " " + stack);
        
    }else{
        res.status(status).send(message);
    }
});


// Start server
app.listen(PORT, () => {
  console.log(`RUNNING ON PORT ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
