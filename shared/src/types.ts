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
    name,
    color,
  }: {
    id: string;
    pos: { X: number; Y: number } | null;
    name: string;
    color: string;
  }) => void;
  messageUpdate: ({
    id,
    msg,
    color,
    name,
  }: {
    id: string;
    msg: string;
    name: string;
    color: string;
  }) => void;
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
