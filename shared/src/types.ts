export interface ServerToClientEvents {
  newUser: ({
    id,
    name,
    color,
  }: {
    id: string;
    name: string;
    color: string;
  }) => void;
  cursorUpdate: ({
    id,
    pos,
  }: {
    id: string;
    pos: { X: number; Y: number } | null;
  }) => void;
  messageUpdate: ({ id, msg }: { id: string; msg: string }) => void;
}

export interface ClientToServerEvents {
  cursorPosition: ({ pos }: { pos: { X: number; Y: number } | null }) => void;
  sendMessage: (msg: string) => void;
  message: (msg: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
