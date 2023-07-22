import { useState } from "react";
import search from "../../assets/Whatsapp (1).png";

function SearchFind({ props }) {
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ava, setAve] = useState([]);
  const [mes, setMes] = useState("");

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
    setIsLoading(false);
  };
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
    props.joinRoom;
    setIsLoading(false);
  };

  return (
    <section className={isLoading ? "animate-pulse m-6" : "m-6 transition-all"}>
      <div className="relative flex justify-start items-center z-20">
        <img src={search} alt="search" className="absolute left-3" />
        <input
          type="type"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          name="userEmail"
          placeholder="Start new chat"
          className={`bg-[#F2F3F5] px-10 border-none ring-2 ring-gray-400 focus:ring-stone-700 focus:ring-2 outline-none focus:border-none py-2 font-semibold rounded-3xl`}
          onKeyDown={(event) => event.key === "Enter" && searchUser()}
          disabled={isLoading}
        />
        <p>{mes}</p>
      </div>
      <div>
        {ava.length === 0 ? (
          <p>You don&lsquo;t have any chats</p>
        ) : (
          ava.map((ele, ind) => (
            <div
              key={ind}
              className={
                "flex justify-start items-center bg-slate-100 w-[17.2rem] px-4 pt-14 pb-4 relative bottom-10 z-10 rounded-xl hover:bg-slate-200 cursor-pointer focus:bg-slate-400 "
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
