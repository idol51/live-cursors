import { Server } from "socket.io";
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "@shared/types";
import dotenv from "dotenv";
import express, { Response, Request } from "express";
import { createServer } from "http";

dotenv.config();

const port = process.env.PORT || 3000;

const app = express();
const httpServer = createServer(app);

app.get("/healthz", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "OK",
  });
});

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

  socket.on("sendMessage", (msg) => {
    socket.broadcast.emit("messageUpdate", { id: socket.id, msg });
  });
});

httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
