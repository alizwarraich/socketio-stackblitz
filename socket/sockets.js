const { instrument } = require("@socket.io/admin-ui");

const listen = (io) => {
    // to save connected users
    let users = [];

    // on connection establish
    io.on("connection", async (socket) => {
        // get all connected sockets
        const sockets = await io.fetchSockets();

        // on user join
        socket.on("custom", (user) => {
            // if users array does not contain a user having same name, push the user object into users array
            users = [...users.filter((prev) => prev.name !== user.name), user];

            // disconnect the socket if user is already connected
            for (const socket of sockets) {
                let userIds = users.map((user) => user.id);
                if (!userIds.includes(socket.id)) {
                    console.log("Disconnected: ", socket.id);
                    socket.disconnect();
                }
            }

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
};

module.exports = {
    listen,
};
