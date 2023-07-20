import { useEffect } from "react";
import io from "socket.io-client";

const Chatting = () => {
  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io();
    socket.on("connect", () => {
      console.log("Connected to the server.");

      // You can emit events from the client to the server using `socket.emit`:
      socket.emit("clientEvent", "Hello from the client!");

      // Handle custom events sent from the server to the client:
      socket.on("serverEvent", (data) => {
        console.log("Received data from the server:", data);
      });
    });

    // Handle the 'disconnect' event
    socket.on("disconnect", () => {
      console.log("Disconnected from the server.");
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>{/* Your React component content */}</div>;
};

export default Chatting;
