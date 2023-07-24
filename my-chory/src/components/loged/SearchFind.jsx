import { useState, useEffect } from "react";
import search from "../../assets/Whatsapp (1).png";

function SearchFind({ props }) {
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ava, setAve] = useState([]);
  const [mes, setMes] = useState("");
  const [dataa, setDataa] = useState([]);

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
      .then((data) => console.log(data));
  };

  useEffect(() => {
    getList();
    getChats();
  }, []);

  // <button onClick={props.joinRoom} disabled={isLoading}>
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
    <section className="m-6 transition-all">
      <div className={isLoading ? "animate-pulse" : ""}>
        <div className=" flex justify-start items-center z-20">
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
                  ? "text-sm text-red-400 "
                  : "text-sm text-green-600"
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
                    className={` p-2 rounded-full w-fit`}
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
        <h2 className="text-3xl font-semibold">All chats</h2>

        {dataa.length === 0 ? (
          <p className="underline opacity-70 mt-10 text-center text-slate-400 ">
            List is empty
          </p>
        ) : (
          dataa.map((obj, ind) => {
            if (obj.type == "receiver" && obj.type == "sender") {
              return (
                <>
                  <div
                    key={ind}
                    className=" bg-emerald-400 font-semibold px-2 py-1 rounded-lg m-3"
                  >
                    <p className="text-sm italic underline">Friend request</p>
                    <div className="mt-2 flex justify-between">
                      <div>
                        <p>Name: {obj.name}</p>
                        <p>Email: {obj.email}</p>
                        <p>Bio: {obj.bio}</p>
                      </div>
                      <div className=" relative bottom-3  flex flex-col justify-between">
                        <button
                          onClick={() => acceptUser(obj.email)}
                          className="mb-2 bg-blue-400 p-2 rounded-xl text-white"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => rejectRequest(obj.email)}
                          className="bg-red-500 text-white p-2 rounded-xl"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    key={ind}
                    className="p-4 rounded-2xl bg-slate-400 animate-pulse w-fit"
                  >
                    <p>State: pending</p>
                    <div className="flex">
                      <p className="mr-4">{obj.name}</p>
                      <p>{obj.email}</p>
                    </div>
                  </div>
                </>
              );
            } else if (obj.type == "receiver") {
              return (
                <div
                  key={ind}
                  className=" bg-emerald-400 font-semibold px-2 py-1 rounded-lg m-3"
                >
                  <p className="text-sm italic underline">Friend request</p>
                  <div className="mt-2 flex justify-between">
                    <div>
                      <p>Name: {obj.name}</p>
                      <p>Email: {obj.email}</p>
                      <p>Bio: {obj.bio}</p>
                    </div>
                    <div className=" relative bottom-3  flex flex-col justify-between">
                      <button
                        onClick={() => acceptUser(obj.email)}
                        className="mb-2 bg-blue-400 p-2 rounded-xl text-white"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectRequest(obj.email)}
                        className="bg-red-500 text-white p-2 rounded-xl"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              );
            } else if (obj.type == "sender") {
              return (
                <div
                  key={ind}
                  className="p-4 rounded-2xl bg-slate-400 animate-pulse w-fit"
                >
                  <p>State: pending</p>
                  <div className="flex">
                    <p className="mr-4">{obj.name}</p>
                    <p>{obj.email}</p>
                  </div>
                </div>
              );
            } else {
              return "";
            }
          })
        )}
      </div>
    </section>
  );
}

export default SearchFind;

{
  /* {ele.name.split(" ") == 1
  ? ele.name[0] + ele.name[ele.name.length - 1]
  : ele.name[0][0] + ele.name[ele.name.length - 1]} */
}

{
  /* 
<input
  type="text"
  placeholder="Eslam..."
  value={props.username}
  onChange={(e) => props.setUsername(e.target.value)}
/>
<input
  type="text"
  placeholder="Room..."
  value={props.room}
  onChange={(e) => props.setRoom(e.target.value)}
/> */
}
{
  /*
  Join a room
</button> */
}

// typeof ele == "object" ? (
//   <div key={ind}>
//     <p>{ele[ind].name}</p>
//   </div>
// ) : // <div
//   key={ind}
//   className="p-4 rounded-2xl bg-slate-400 animate-pulse w-fit"
// >
//   <p>State: pending</p>
//   <div className="flex">
//     <p className="mr-4">{ele.name}</p>
//     <p>{ele.email}</p>
//   </div>
// </div>
// ele.type == "receiver" ? (
//   <div
//     key={ind}
//     className=" bg-emerald-400 font-semibold p-4 rounded-lg m-3"
//   >
//     <p className="text-sm italic underline">Friend request</p>
//     <div className="mt-2 flex justify-between">
//       <div>
//         <p>Name: {ele.name}</p>
//         <p>Email: {ele.email}</p>
//         <p>Bio: {ele.bio}</p>
//       </div>
//       <div className="flex flex-col justify-between">
//         <button className="mb-2 bg-blue-400 p-2 rounded-xl text-white">
//           Accept
//         </button>
//         <button
//           onClick={() => rejectRequest()}
//           className="bg-red-500 text-white p-2 rounded-xl"
//         >
//           Reject
//         </button>
//       </div>
//     </div>
//   </div>
// ) : (
//   ""
// )
