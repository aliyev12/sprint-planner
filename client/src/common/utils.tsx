import { io, Socket } from "socket.io-client";
import { ICurrentSession } from "./models";
import { useEffect, useState } from "react";

export const isNumOrFloat = (num: string | number) =>
  /^[+-]?\d+(\.\d+)?$/g.test(num.toString());

export const categoryActive = (
  currentSession: ICurrentSession,
  categoryId: string
) => {
  if (
    currentSession &&
    currentSession.active &&
    currentSession.activeCategoryId === categoryId
  )
    return true;
  return false;
};

export const truncate = (
  str: string,
  len: number = 14,
  dots: boolean = false
): string => {
  if (str.length > len && str.length > 0) {
    let new_str = str + " ";
    new_str = str.substr(0, len);
    new_str = str.substr(0, new_str.lastIndexOf(" "));
    new_str = new_str.length > 0 ? new_str : str.substr(0, len);
    new_str =
      str.split(" ")[0].length > len
        ? str.split(" ")[0].substr(0, len - 3) + "..."
        : new_str;
    new_str =
      str.split(" ")[0].length <= len && dots ? new_str + "..." : new_str;
    return new_str;
  }
  return str;
};

export const triggedDomEvent = (
  id: string = "select-current-category",
  type: string = "change"
) => {
  const evt = document.createEvent("HTMLEvents");
  evt.initEvent(type, false, true);
  const element = document.getElementById(id);
  if (element) element.dispatchEvent(evt);
};

export const extractRoomId = (str: string): string => {
  const matched = str.match(/20\d{2}-\d{2}-\d{2}-(.+)/gim);
  if (matched && matched.length) return matched[0];
  return str;
};

export const getEndpoint = () => {
  return import.meta.env.VITE_SERVER_ENDPOINT;
};

interface SocketOptions {
  maxRetries?: number;
  retryDelay?: number;
  onConnect?: () => void;
  onError?: (error: Error) => void;
  timeout?: number;
}

export const createSocketConnection = (options: SocketOptions = {}): Socket => {
  const {
    maxRetries = 3,
    retryDelay = 2000,
    onConnect,
    onError,
    timeout = 10000,
  } = options;

  const ENDPOINT = getEndpoint() || "localhost:3333";
  let retries = 0;

  const socket = io(ENDPOINT, {
    reconnectionAttempts: maxRetries,
    reconnectionDelay: retryDelay,
    timeout,
  });

  socket.on("connect", () => {
    console.log("Socket connected successfully");
    if (onConnect) onConnect();
  });

  socket.on("connect_error", (error) => {
    console.log("Connection error:", error);
    if (onError) onError(error);

    if (retries < maxRetries) {
      retries++;
      console.log(`Retrying connection... Attempt ${retries}`);
      setTimeout(() => {
        socket.connect();
      }, retryDelay);
    }
  });

  return socket;
};

// Custom hook for socket connections
// export const useSocketConnection = (options: SocketOptions = {}) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnecting, setIsConnecting] = useState(true);
//   const [connectionError, setConnectionError] = useState(false);

//   useEffect(() => {
//     const newSocket = createSocketConnection({
//       ...options,
//       onConnect: () => {
//         setIsConnecting(false);
//         setConnectionError(false);
//         if (options.onConnect) options.onConnect();
//       },
//       onError: (error) => {
//         setConnectionError(true);
//         if (options.onError) options.onError(error);
//       },
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.off("connect");
//       newSocket.off("connect_error");
//       newSocket.disconnect();
//     };
//   }, []);

//   return { socket, isConnecting, connectionError };
// };

// Custom hook for socket connections
export const useSocketConnection = (options: SocketOptions = {}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    // Function to ping server
    const pingServer = async () => {
      try {
        const response = await fetch(`http://${getEndpoint()}/ping`);
        if (!response.ok) {
          throw new Error("Server ping failed");
        }
        return true;
      } catch (error) {
        console.log("Server warming up, retrying ping...");
        return false;
      }
    };

    // Function to attempt connection with ping
    const attemptConnection = async () => {
      const maxPingRetries = 3;

      for (let i = 0; i <= maxPingRetries; i++) {
        const serverReady = await pingServer();
        if (serverReady) {
          // Server is awake, create socket connection
          const newSocket = createSocketConnection({
            ...options,
            onConnect: () => {
              setIsConnecting(false);
              setConnectionError(false);
              if (options.onConnect) options.onConnect();
            },
            onError: (error) => {
              setConnectionError(true);
              if (options.onError) options.onError(error);
            },
          });

          setSocket(newSocket);
          return newSocket;
        }

        // Wait before next ping attempt
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // If we get here, ping attempts failed
      setConnectionError(true);
      if (options.onError) {
        setIsConnecting(false);
        options.onError(new Error("Server unavailable"));
      }
      return null;
    };

    // Start the connection process
    let socketInstance: Socket | null = null;
    attemptConnection().then((newSocket) => {
      socketInstance = newSocket;
    });

    // Cleanup
    return () => {
      if (socketInstance) {
        socketInstance.off("connect");
        socketInstance.off("connect_error");
        socketInstance.disconnect();
      }
    };
  }, []);

  return { socket, isConnecting, connectionError };
};
