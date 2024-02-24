// SocketManager.ts

import io, { Socket } from "socket.io-client";

class SocketManager {
  private static instance: SocketManager | null = null;
  private socket: Socket | null = null;

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  connect(url: string): void {
    this.socket = io(url);
    // Add other socket event listeners and initialization logic here
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export default SocketManager.getInstance();
