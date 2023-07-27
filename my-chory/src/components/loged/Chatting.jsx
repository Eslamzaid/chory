import { useEffect, useState } from "react";
import io from "socket.io-client";
import { checkIsAuth } from "../../utls/func";
import { useNavigate } from "react-router-dom";
import ScrollToBottom from "react-scroll-to-bottom";
import SearchFind from "./SearchFind";
import send from "../../assets/send.png";
import close from "../../assets/close.png";

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
  const [email, setEmail] = useState("");
  const [info, setInfo] = useState([]);
  const [show, setShow] = useState([]);
  const [fin, setFin] = useState(false);

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

  const delChat = async (email) => {
    try {
      await fetch("http://localhost:4000/home/delChat", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email }),
      });

      console.log("Deleted");
      location.reload();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <article
      className={` transition-all grid ${fin ? "grid-cols-5" : "grid-cols-4"} `}
    >
      <SearchFind
        setUsername={setUsername}
        setRoom={setRoom}
        joinRoom={joinRoom}
        setEmail={setEmail}
        setMessageList={setMessageList}
        setInfo={setInfo}
        setShow={setShow}
        show={show}
        setFin={setFin}
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
            <ScrollToBottom className="w-full h-full overflow-hidden">
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
      {show.length == 0 ? (
        ""
      ) : fin == true ? (
        <section className="shadow-2xl">
          <div className="flex font-medium font-snsn  m-5 xl:m-7">
            <img
              src={close}
              className="w-4 mr-4 cursor-pointer object-contain opacity-80"
              onClick={() => setFin(!fin)}
              alt="Close bio"
            />
            <p>Contact info</p>
          </div>
          <div className="flex flex-col justify-center items-center mt-10 m-5 xl:m-7">
            <div className="bg-[#370866] flex justify-center items-center rounded-full w-36 h-36 xl:w-48 xl:h-48 ">
              <h2 className="rounded-full  font-bold text-5xl xl:text-8xl text-white">
                {info.name.slice(0, 1).toUpperCase() +
                  info.name[info.name.length - 1].toUpperCase()}
              </h2>
            </div>
            <h3 className="capitalize font-semibold text-4xl my-2">
              {info.name}
            </h3>
          </div>
          <div className="xl:mt-20 mt-20 text-center m-5 xl:m-7">
            <h4 className="font-bold">About</h4>
            <h5 className="opacity-90 xl:text-base text-sm text-slate-600 mt-3 mb-2">
              Eamil: {info.email}
            </h5>
            <h5 className="opacity-90 xl:text-base text-sm text-slate-600 my-2">
              Bio: {info.bio}
            </h5>
            <h5 className="opacity-90 xl:text-base text-sm text-slate-600">
              Phone: {info.phone}
            </h5>
          </div>
          <div className="xl:mt-48 mt-48 flex justify-center m-5 xl:m-7">
            <button
              onClick={() => delChat(info.email)}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Delete contact
            </button>
          </div>
        </section>
      ) : (
        ""
      )}
    </article>
  );
};

export default Chatting;
