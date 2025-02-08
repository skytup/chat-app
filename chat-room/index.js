const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Track connected clients
const connectedClients = new Set();

io.on("connection", (client) => {
    connectedClients.add(client.id);
    console.log("New user connected:", client.id);
    io.emit("online", connectedClients.size);

    client.on("disconnect", () => {
        connectedClients.delete(client.id);
        console.log("User disconnected:", client.id);
        io.emit("online", connectedClients.size);
    });

    client.on("message", (message) => {
        const sanitizedMessage = message.toString().trim().substring(0, 200);
        console.log("Received:", sanitizedMessage);
        io.emit("response", {
            text: sanitizedMessage,
            time: new Date().toLocaleTimeString()
        });
    });
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

server.listen(9000, () => {
    console.log("Server Started at Port 9000");
});