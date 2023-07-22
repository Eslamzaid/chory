import { useState, useEffect, Suspense } from "react";
import search from "../../assets/Whatsapp (1).png";

function SearchFind({ props }) {
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ava, setAve] = useState([]);
  const [mes, setMes] = useState("");
  const [data, setData] = useState([]);

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
      setMes(data.message);
      setIsLoading(false);
      return;
    }
    setAve(await data);
    setMes("");
    setIsLoading(false);
  };
  // const getDat = () => {
  // fetch("http://localhost:4000/home", {
  //   method: "GET",
  //   credentials: "include",
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     if (data.success == false) {
  //       // console.log(data.message);
  //     } else {
  //       setData(data);
  //       setMes("");
  //       console.log(data)
  //     }
  //   })
  //   .catch((e) => console.error(`Error fetching data: ${e}`));
  // };

  useEffect(() => {
    // getDat();
    fetch("http://localhost:4000/home", {
      method: "GET",
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success == false) {
          // console.log(data.message);
        } else {
          setData(data);
          setMes("");
          console.log(data);
        }
      })
      .catch((e) => console.error(`Error fetching data: ${e}`));
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
    console.log(body);
    if (body.success == false) {
      setMes(body.message);
      setIsLoading(false);
    }
    // props.joinRoom;
    setIsLoading(false);
  };

  return (
    <section className="m-6 transition-all">
      <div className={isLoading ? "animate-pulse" : ""}>
        <div className="relative flex justify-start items-center z-20">
          <img
            src={search}
            alt="search"
            className={`absolute left-3 ${mes == "" ? "" : "mb-5"}`}
          />
          <div className="flex flex-col w-full">
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
            <p className="text-sm text-red-400 ">{mes}</p>
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
        {data.length == 0 ? (
          <p className="underline opacity-70 mt-10 text-center text-slate-400 ">
            List is empty
          </p>
        ) : (
          data.map((ele, ind) => (
            <div key={ind}>
              <p>{ele.name}</p>
              <p>{ele.email}</p>
            </div>
          ))
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
