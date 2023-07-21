import { useEffect, useState } from "react";
import io from "socket.io-client";
import { checkIsAuth } from "../../utls/func";
import { useNavigate } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";

const Chatting = () => {
  const navigate = useNavigate();
  // A state for controlling the grid and hide/show the about of the user
  useEffect(() => {
    const checking = async () => {
      const check = await checkIsAuth();
      if (!check.success) {
        navigate("/");
      }
    };

    checking();
  });

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [show, setShow] = useState(false);
  const [messageList, setMessageList] = useState([]);

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

  const joinRoom = () => {
    if (username !== "" && room != "") {
      socket.emit("join_room", room);
      setShow(true);
    }
  };

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      setCurrentMessage("")
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <article>
      {!show ? (
        <section>
          <h2>Join a Chat</h2>
          <input
            type="text"
            placeholder="Eslam..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room..."
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join a room</button>
        </section>
      ) : (
        <>
          <section className="bg-red-400 w-96 h-96 overflow-y-hidden">
            <ScrollToBottom className=" w-full h-full overflow-y-hidden overflow-x-hidden">
              {messageList.map((ele, ind) => {
                return (
                  <div key={ind}>
                    <div
                      className={ele.author === username ? "" : "float-right"}
                    >
                      <h6>{ele.author}</h6>
                      <h2>{ele.message}</h2>
                    </div>
                  </div>
                );
              })}
            </ScrollToBottom>
          </section>
          <section>
            <div>
              <p>Live Chat</p>
            </div>
            <div></div>
            <div>
              <input
                type="text"
                placeholder="Hey..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyUp={(event) => {
                  event.key == "Enter" && sendMessage();
                }}
              />
              <button className="bg-slate-300" onClick={sendMessage}>
                &#9658;
              </button>
            </div>
          </section>
        </>
      )}
    </article>
  );
};

export default Chatting;
