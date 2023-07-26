import { useEffect, useState } from "react";
import io from "socket.io-client";
import { checkIsAuth } from "../../utls/func";
import { useNavigate } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import SearchFind from "./SearchFind";
import send from "../../assets/send.png";

const Chatting = () => {
  const navigate = useNavigate();
  const [emailId, setEmailId] = useState("");

  useEffect(() => {
    const checking = async () => {
      const check = await checkIsAuth();
      if (check.success == false) {
        navigate("/");
      } else {
        const { id } = check;
        setEmailId(id);
      }
    };
    checking();
  }, []);

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [bio, setBio] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const socket = io.connect("http://localhost:4000");

  const joinRoom = (room, username) => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
    }
  };

  const sendMessage = async () => {
    if (/^(?!\s*$).+/.test(currentMessage)) {
      const messageData = {
        room: room,
        author: username,
        id: emailId,
        message: currentMessage,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
        email: email,
      };
      await socket.emit("send_message", messageData);
      setCurrentMessage("");
    } else {
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [socket]);

  console.log(messageList);

  return (
    <article className={`grid grid-cols-4`}>
      <SearchFind
        setUsername={setUsername}
        room={room}
        setRoom={setRoom}
        joinRoom={joinRoom}
        setBio={setBio}
        setName={setName}
        setPhone={setPhone}
        setEmail={setEmail}
        setMessageList={setMessageList}
      />
      <section
        className={`bg-[#F7F8FA] flex flex-col justify-end overflow-hidden h-screen w-full col-span-3`}
      >
        <div className="overflow-hidden ">
          {room.length === 0 ? (
            <p className="flex justify-center h-screen items-center opacity-50">
              Select a chat to start chatting
            </p>
          ) : (
            <ScrollToBottom className=" w-full h-full overflow-hidden  ">
              {messageList.map((ele, ind) => {
                if (ele.room == room) {
                  return (
                    <div key={ind} className="mx-5 mt-6 flex flex-col">
                      <div
                        className={`min-w-[2rem] rounded-xl w-fit  px-4 py-3 ${
                          ele.author === username
                            ? "bg-[#E8ECEF]"
                            : "ml-auto bg-[#72808B]"
                        }`}
                      >
                        <div className="max-w-[20rem] break-words">
                          <h2
                            className={
                              ele.author === username ? "" : "text-white"
                            }
                          >
                            {ele.message}
                          </h2>
                        </div>
                      </div>
                      <h4
                        className={`text-xs ${
                          ele.author === username
                            ? "justify-self-end"
                            : "ml-auto"
                        }
                        `}
                      >
                        {ele.time}
                      </h4>
                    </div>
                  );
                }
              })}
            </ScrollToBottom>
          )}
        </div>
        <div className={room.length === 0 ? "" : "p-10"}>
          {room.length === 0 ? (
            ""
          ) : (
            <div className="flex shadow-xl bg-white p-3 rounded-3xl">
              <input
                type="text"
                autoFocus={true}
                className="w-full focus:border-none focus:outline-none focus:ring-0 "
                placeholder="Type a message now"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(event) => {
                  event.key == "Enter" && sendMessage();
                }}
              />
              <button
                className="object-contain w-7 items-center"
                onClick={sendMessage}
              >
                <img src={send} alt="send message" className="" />
              </button>
            </div>
          )}
        </div>
      </section>
      {/* <section></section> */}
    </article>
  );
};

export default Chatting;
