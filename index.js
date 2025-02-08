const http = require("http");

const express = require("express")

const path = require("path");
const { Server } = require("socket.io");

const app = express();

const server = http.createServer(app);
const io = new Server(erver);

io.on("connection",(client)=>{
console.log("New user connected "+ client.id);
});

app.use(express.static(path.resolve("./public")));
app.get("/", (req, res) => {
    res.sendFile("./public/index.html");
})

server.listen(9000, () => {
    console.log("Server Started at Port 9000");
});