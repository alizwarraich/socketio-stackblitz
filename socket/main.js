const express = require("express");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const app = express();

const port = 8080;

// create a new server instance
const io = new Server(port, {
    cors: {
        origin: ["http://localhost:5173", "https://admin.socket.io"],
        credentials: true,
    },
});

// to save connected users
let users = [];

// on connection establish
io.on("connection", (socket) => {
    // on user join
    socket.on("custom", (user) => {
        // if users array does not contain a user having same name, push the user object into users array
        users = [...users.filter((prev) => prev.name !== user.name), user];
        console.log(users);
        console.log("Total clients connected: ", users.length);
        io.emit("users", users);
    });

    // on message received
    socket.on("msg", (obj) => {
        console.log(obj);
        socket.to(obj.receiver).emit("received", obj.msg);
    });

    // on user disconnect
    socket.on("disconnect", () => {
        users = users.filter((user) => user.id !== socket.id);
        console.log("Total clients connected: ", users.length);
    });
});

instrument(io, {
    auth: false,
    mode: "development",
});

app.listen(8000, () => {
    console.log("Server listening on port 8000");
});
