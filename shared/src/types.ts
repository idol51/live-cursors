export interface ServerToClientEvents {
  newUser: ({ id, name }: { id: string; name: string }) => void;
  cursorUpdate: ({
    id,
    pos,
  }: {
    id: string;
    pos: { X: number; Y: number } | null;
  }) => void;
}

export interface ClientToServerEvents {
  cursorPosition: ({ pos }: { pos: { X: number; Y: number } | null }) => void;
  message: (msg: string) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}
