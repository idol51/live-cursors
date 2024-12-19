import { useEffect, useState } from "react";
import { throttle } from "./lib/utils";
import { MousePointer2 } from "lucide-react";
import { Input } from "./components/ui/input";
import { socket } from "./lib/socket";

export default function App() {
  const [cursors, setCursors] = useState<{
    [id: string]: {
      name: string;
      pos: { X: number; Y: number } | null;
      msg: string;
    };
  }>(
    socket.id
      ? {
          [socket.id]: {
            name: "Username",
            pos: null,
            msg: "",
          },
        }
      : {}
  );

  const [showInput, setShowInput] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const throttledMessageChange = throttle<(msg: string) => void>(
    (msg: string) => {
      socket.emit("sendMessage", msg);
    },
    50
  );

  const throttledMouseMove = throttle<(e: MouseEvent) => void>(
    (e: MouseEvent) => {
      socket.emit("cursorPosition", {
        pos: { X: e.clientX, Y: e.clientY },
      });
      if (socket.id !== undefined) {
        const updatedCursor = {
          ...cursors[socket.id],
          pos: { X: e.clientX, Y: e.clientY },
        };
        setCursors((prev) => ({
          ...prev,
          [socket.id as string]: updatedCursor,
        }));
      }
    },
    50
  );

  const handleKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();
    if (e.key === "/") setShowInput(true);
    else if (e.key === "Escape") setShowInput(false);
    else if (showInput) {
      if (e.key === "Backspace")
        setMessage((prev) => prev.slice(0, prev.length - 1));
      else if (e.key.length === 1) setMessage((prev) => prev + e.key);
    }
  };

  useEffect(() => {
    throttledMessageChange(message);
  }, [message]);

  useEffect(() => {
    document.addEventListener("mousemove", throttledMouseMove);
    document.addEventListener("mouseenter", (e) => {
      socket.emit("cursorPosition", {
        pos: { X: e.clientX, Y: e.clientY },
      });
      if (socket.id !== undefined) {
        const updatedCursor = {
          ...cursors[socket.id],
          pos: { X: e.clientX, Y: e.clientY },
        };
        setCursors((prev) => ({
          ...prev,
          [socket.id as string]: updatedCursor,
        }));
      }
    });
    document.addEventListener("mouseleave", () => {
      socket.emit("cursorPosition", {
        pos: null,
      });
      if (socket.id !== undefined) {
        const updatedCursor = {
          ...cursors[socket.id],
          pos: null,
        };
        setCursors((prev) => ({
          ...prev,
          [socket.id as string]: updatedCursor,
        }));
      }
    });
    document.addEventListener("keypress", (e) => {
      console.log(e.key);
    });

    socket.on("newUser", ({ id, name }) => {
      setCursors((prev) => ({
        ...prev,
        [id]: {
          name,
          pos: null,
          msg: "",
        },
      }));
    });

    socket.on("cursorUpdate", ({ id, pos }) => {
      setCursors((prev) => {
        const updatedCursor = { ...prev[id], pos };
        return { ...prev, [id]: updatedCursor };
      });
    });

    socket.on("messageUpdate", ({ id, msg }) => {
      setCursors((prev) => {
        const updatedCursor = { ...prev[id], msg };
        return { ...prev, [id]: updatedCursor };
      });
    });

    return () => {
      document.removeEventListener("mousemove", throttledMouseMove);
      document.removeEventListener("mouseenter", (e) => {
        socket.emit("cursorPosition", {
          pos: { X: e.clientX, Y: e.clientY },
        });
        if (socket.id !== undefined) {
          const updatedCursor = {
            ...cursors[socket.id],
            pos: { X: e.clientX, Y: e.clientY },
          };
          setCursors((prev) => ({
            ...prev,
            [socket.id as string]: updatedCursor,
          }));
        }
      });
      document.removeEventListener("mouseleave", () => {
        socket.emit("cursorPosition", {
          pos: null,
        });
        if (socket.id !== undefined) {
          const updatedCursor = {
            ...cursors[socket.id],
            pos: null,
          };
          setCursors((prev) => ({
            ...prev,
            [socket.id as string]: updatedCursor,
          }));
        }
      });
    };
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showInput]);

  return (
    <div className="h-screen relative w-screen overflow-hidden cursor-none">
      {Object.entries(cursors).map(([id, data]) => (
        <div
          className="absolute z-50"
          style={
            data.pos
              ? { top: data.pos.Y - 26, left: data.pos.X - 4 }
              : { display: "none" }
          }
        >
          <span>{data.name}</span>
          <MousePointer2 fill={"black"} />
          {id === socket.id ? (
            showInput && (
              <Input
                className="shadow-lg rounded-full px-4 bg-white mt-2 w-72"
                placeholder="Say something.."
                value={message}
              />
            )
          ) : (
            <span>{data.msg}</span>
          )}
        </div>
      ))}
      <div className="flex flex-col gap-3 opacity-80 items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <span>
          Press{" "}
          <span className="border px-1 rounded bg-green-300 border-green-600">
            /
          </span>{" "}
          to start messaging.
        </span>
        <span>
          Press{" "}
          <span className="border px-1 rounded bg-green-300 border-green-600">
            Esc
          </span>{" "}
          to stop messaging.
        </span>
      </div>
    </div>
  );
}
