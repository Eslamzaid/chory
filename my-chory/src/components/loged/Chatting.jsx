import { useEffect } from "react";
import io from "socket.io-client";
import { checkIsAuth } from "../../utls/func";
import { useNavigate } from "react-router-dom";

const Chatting = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const checking = async () => {
      const check = await checkIsAuth();
      if (!check.success) {
        navigate("/");
      }
    };

    checking();
  });
  const socket = io.connect("http://localhost:4000");
  // useEffect(() => {
  //   // Connect to the Socket.IO server
  //   try {
  //     socket.on("connect", () => {
  //       console.log("Connected to the server.");

  //       // You can emit events from the client to the server using `socket.emit`:
  //       socket.emit("clientEvent", "Hello from the client!");

  //       // Handle custom events sent from the server to the client:
  //       socket.on("serverEvent", (data) => {
  //         console.log("Received data from the server:", data);
  //       });
  //     });
  //   } catch (error) {
  //     console.log("The socket error:", error);
  //   }

  //   // Handle the 'disconnect' event
  //   socket.on("disconnect", () => {
  //     console.log("Disconnected from the server.");
  //   });

  //   // Clean up the socket connection when the component unmounts
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  return <div>hi</div>;
};

export default Chatting;
