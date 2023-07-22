import { useEffect, useState } from "react";
import io from "socket.io-client";
import { checkIsAuth } from "../../utls/func";
import { useNavigate } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import SearchFind from "./SearchFind";

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
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  return (
    <article className={`grid ${show ? "grid-cols-3" : "grid-cols-2"}`}>
      <SearchFind
        props={{
          username: username,
          setUsername: setUsername,
          room: room,
          setRoom: setRoom,
          joinRoom: joinRoom,
        }}
      />
      <section>
        <div className="bg-red-400 w-96 h-96 overflow-y-hidden">
          <ScrollToBottom className=" w-full h-full overflow-y-hidden overflow-x-hidden">
            {messageList.map((ele, ind) => {
              return (
                <div key={ind}>
                  <div className={ele.author === username ? "" : "float-right"}>
                    <h6>{ele.author}</h6>
                    <h2>{ele.message}</h2>
                  </div>
                </div>
              );
            })}
          </ScrollToBottom>
        </div>
        <div>
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
        </div>
      </section>
      <section></section>
    </article>
  );
};

export default Chatting;
