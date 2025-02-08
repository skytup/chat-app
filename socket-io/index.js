const http = require("http");
const express = require("express");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (client) => {
    console.log("New user connected:", client.id);

    // Send the correct live user count
    io.emit("online", io.engine.clientsCount);

    client.on("disconnect", () => {
        console.log("User disconnected:", client.id);
        io.emit("online", io.engine.clientsCount);
    });

    // Handle messages
    client.on("message", (message) => {
        console.log("Received:", message);
        io.emit("response", `<h3>${message}</h3>`);
    });
});

// Serve static files
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

server.listen(9000, () => {
    console.log("Server Started at Port 9000");
});
