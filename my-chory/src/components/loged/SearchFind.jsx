import { useState, useEffect } from "react";
import search from "../../assets/Whatsapp (1).png";

function SearchFind({ setUsername, setRoom, joinRoom }) {
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ava, setAve] = useState([]);
  const [mes, setMes] = useState("");
  const [dataa, setDataa] = useState([]);
  const [chats, setChats] = useState([]);

  const searchUser = async () => {
    setIsLoading(true);

    const response = await fetch("http://localhost:4000/home/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: userEmail.trim() }),
    });

    const data = await response.json();

    if (data.success == false) {
      setMes([data.message, false]);
      setIsLoading(false);
      setAve([]);
      return;
    } else {
      setAve(await data);
      setMes([data.message, true]);
      setIsLoading(false);
    }
  };

  const getList = () => {
    fetch("http://localhost:4000/home/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success == false) {
          console.log(data.message);
        } else {
          setDataa(data);
          setMes("");
        }
      })
      .catch((e) => console.error(`Error fetching dataa: ${e}`));
  };

  const getChats = () => {
    fetch("http://localhost:4000/home/chats", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === false) {
          console.log(data.message);
        } else {
          setChats(data);
        }
      });
  };

  const handleClick = (roNum, userName) => {
    setRoom(roNum);
    setUsername(userName);
    joinRoom(roNum, userName);
  };

  useEffect(() => {
    getList();
    getChats();
  }, []);

  const requestUser = async () => {
    setIsLoading(true);
    const response = await fetch("http://localhost:4000/home/addUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: userEmail.trim() }),
    });
    const body = await response.json();
    if (body.success == false) {
      setMes([body.message, false]);
      setIsLoading(false);
      setAve([]);
    } else {
      getList();
      setIsLoading(false);
      setMes([body.message, true]);
      setUserEmail("");
      setAve([]);
    }
  };

  const rejectRequest = async (email) => {
    fetch("http://localhost:4000/home/rejReq/" + email, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => response.json())
      .then(() => {
        getList();
        if (dataa.length == 1) {
          setDataa([]);
        }
      });
  };

  const acceptUser = async (email) => {
    const response = await fetch("http://localhost:4000/home/acceptUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: email.trim() }),
    });
    const data = await response.json();
    if (data.success == true) {
      console.log(data.message);
      getList();
      if (dataa.length == 1) {
        setDataa([]);
      }
    } else {
      console.log(data.message);
    }
  };

  return (
    <section className="m-6 transition-all font-sans ">
      <div className={isLoading ? "animate-pulse" : ""}>
        <div className="flex justify-start items-center z-20">
          <img
            src={search}
            alt="search"
            className={`absolute left-9 top-9 z-30`}
          />
          <div className="flex flex-col w-full z-20">
            <input
              type="type"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              name="userEmail"
              placeholder="Start new chat"
              className={`bg-[#F2F3F5] w-full px-10 border-none ring-2 ring-gray-400 focus:ring-stone-700 focus:ring-2 outline-none focus:border-none py-2 font-semibold rounded-3xl`}
              onKeyDown={(event) => event.key === "Enter" && searchUser()}
              disabled={isLoading}
            />
            <p
              className={
                mes[1] == false
                  ? "text-sm text-red-400 mt-2"
                  : "text-sm text-green-600 mt-2"
              }
            >
              {mes}
            </p>
          </div>
        </div>
        <div>
          {ava.length === 0
            ? ""
            : ava.map((ele, ind) => (
                <div
                  key={ind}
                  className={
                    "flex justify-start items-center bg-slate-100 w-full px-4 pt-14 pb-4 relative bottom-10 z-10 rounded-xl hover:bg-slate-200 cursor-pointer focus:bg-slate-400 "
                  }
                  onClick={() => requestUser()}
                >
                  <p
                    className={`p-2 rounded-full w-fit`}
                    style={{ backgroundColor: `#${ele.color}` }}
                  >
                    {ele.name}
                  </p>
                  <p
                    className={`ml-4 w-full ${
                      ele.bio.length > 20 ? "truncate" : ""
                    }`}
                  >
                    {ele.bio}
                  </p>
                </div>
              ))}
        </div>
      </div>
      <div className="mt-40">
        <h2 className="text-2xl font-semibold">All chats</h2>

        {dataa.length === 0 && chats.length === 0 ? (
          <p className="underline opacity-70 mt-10 text-center text-slate-400 ">
            List is empty
          </p>
        ) : (
          <div>
            <div>
              {chats.length === 0
                ? ""
                : chats.map((chat, index) => (
                    <div
                      onClick={() => handleClick(chat.room, chat.name)}
                      key={index}
                      className="p-4 hover:cursor-pointer  rounded-2xl bg-slate-100 w-full  my-3"
                    >
                      <div className="flex  items-center">
                        <p className="bg-blue-300 flex justify-center items-center h-10 w-10 mr-3  rounded-full">
                          {chat.name.slice(0, 1).toUpperCase() +
                            chat.name[chat.name.length - 1].toUpperCase()}
                        </p>
                        <div className="text-ellipsis truncate">
                          <p>
                            {chat.name.charAt(0).toUpperCase() +
                              chat.name.slice(1, chat.name.length)}
                          </p>
                          <p className="text-xs text-slate-500">{chat.bio}</p>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
            <div>
              {dataa.map((obj, ind) => {
                if (obj.type === "receiver") {
                  return (
                    <div
                      key={ind}
                      className="bg-slate-50 shadow-lg rounded-lg p-4 m-3 transition-all duration-300"
                    >
                      <p className="text-lg font-semibold underline mb-2">
                        Friend Request
                      </p>
                      <div className="mt-2 flex justify-between">
                        <div>
                          <p className="text-base font-semibold capitalize">
                            Name: {obj.name}
                          </p>
                          <p className="text-xs font-semibold">
                            Email: {obj.email}
                          </p>
                          <p className="text-xs font-normal">
                            Bio: {obj.bio}
                          </p>
                        </div>
                        <div className="flex flex-col justify-between">
                          <button
                            onClick={() => acceptUser(obj.email)}
                            className="mb-2 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => rejectRequest(obj.email)}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-semibold"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                } else if (obj.type === "sender") {
                  return (
                    <div
                      key={ind}
                      className="p-4 rounded-2xl my-2 bg-gray-200 hover:bg-gray-300 transition-all duration-300 w-fit"
                    >
                      <p className="text-sm font-semibold">State: Pending</p>
                      <div className="flex flex-col">
                        <p className="text-base font-medium mr-2 capitalize">
                          Name: {obj.name}
                        </p>
                        <p className="text-base text-gray-600">
                          Email: {obj.email}
                        </p>
                      </div>
                    </div>
                  );
                } else {
                  return null; // Added a condition to return null when the "obj.type" doesn't match any case
                }
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default SearchFind;
