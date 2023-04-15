const express = require("express");
const { Server } = require("socket.io");
const app = express();

const port = 8080;
const io = new Server(port, {
    cors: {
        origin: ["http://localhost:5173"],
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
        socket.to(obj.id).emit("received", obj.msg);
    });

    // on user disconnect
    socket.on("disconnect", () => {
        users = users.filter((user) => user.id !== socket.id);
        console.log("Total clients connected: ", users.length);
    });
});

app.listen(8000, () => {
    console.log("Server listening on port 8000");
});
