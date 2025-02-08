const http = require("http");

const express = require("express")
// const publicIp = require('public-ip');
const path = require("path");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (client) => {
    console.log("New user connected " + client.id);
    client.on("message", (message) => {
        console.log(message);
        io.emit("response", `<h3>${message}</h3>`);
    });
});

app.use(express.static(path.resolve("./public")));
app.get("/", (req, res) => {
    res.sendFile("./public/");
})

server.listen(9000, () => {
    console.log("Server Started at Port 9000");
});