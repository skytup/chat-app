import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const router = express.Router();

// Serve the static files from the React app
router.use(express.static(path.join(__dirname, '../client/build')));

// Socket.io setup with CORS configuration
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Handle socket connections
io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    // Add more socket event handlers here
});

// Use the router
app.use('/', router);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});