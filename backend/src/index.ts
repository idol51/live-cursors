import { createServer } from "http";
import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@shared/types";

const httpServer = createServer();

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit("newUser", {
    id: socket.id,
    name: "Username",
  });

  socket.on("cursorPosition", ({ pos }) => {
    socket.broadcast.emit("cursorUpdate", { id: socket.id, pos });
  });

  socket.on("message", (message) => {
    console.log(message);
  });
});

httpServer.listen(3000);
