const express = require('express');
const { Server } = require('socket.io');
const path = require('path');
const he = require('he');

const app = express();
const server = require('http').createServer(app);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Socket.io setup with CORS configuration
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    path: '/socket.io/'
});

// Store connected users
const users = new Map();

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle user authentication/registration
    socket.on('auth-user', (userData) => {
        const user = {
            username: userData.username,
            avatar: userData.avatar || userData.username.charAt(0).toUpperCase(),
            lastSeen: new Date(),
            status: 'online'
        };
        
        users.set(socket.id, user);
        socket.username = userData.username;
        
        // Send authentication success
        socket.emit('auth-success', user);
        
        // Broadcast to all clients that a new user joined
        io.emit('user-connected', user);
        io.emit('user-list', Array.from(users.values()));
    });

    // Handle chat messages
    socket.on('chat-message', (message) => {
        const user = users.get(socket.id);
        if (user) {
            io.emit('chat-message', {
                id: Date.now(),
                username: user.username,
                avatar: user.avatar,
                message: he.escape(message),
                time: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                })
            });
        }
    });

    // Handle typing status
    socket.on('typing', () => {
        const user = users.get(socket.id);
        if (user) {
            socket.broadcast.emit('user-typing', user);
        }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
        const user = users.get(socket.id);
        if (user) {
            user.status = 'offline';
            user.lastSeen = new Date();
            users.delete(socket.id);
            io.emit('user-disconnected', user);
            io.emit('user-list', Array.from(users.values()));
        }
    });
});

// Update socket.io client connection URL in index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export the server for Vercel
module.exports = server;