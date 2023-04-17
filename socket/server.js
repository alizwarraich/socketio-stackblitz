const http = require("http");
const { Server } = require("socket.io");

const apiServer = require("./api");
const httpServer = http.createServer(apiServer);
const socketServer = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "https://admin.socket.io"],
        credentials: true,
    },
});

const sockets = require("./sockets");

const PORT = 8000;

// listen for new connections
httpServer
    .listen(PORT)
    .on("listening", () => {
        console.log(`Server listening on port ${PORT}`);
    })
    .on("error", (err) => {
        console.error(err);
    });

sockets.listen(socketServer);
