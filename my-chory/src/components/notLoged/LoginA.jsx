import { useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import thmUps from "../../assets/thmUps.png";
import { useNavigate } from "react-router-dom";
import { checkIsAuth } from "../../utls/func";

function LoginA() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mes, setMessage] = useState("");
  const navigate = useNavigate("");

  useEffect(() => {
    const checking = async () => {
      const check = await checkIsAuth();
      if (check.success) {
        navigate("/home");
      }
    };

    checking();
  });
  const signIn = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const result = await response.json();
    if ((await result.success) == true) {
      navigate("/home");
    } else {
      setEmail("");
      setPassword("");
      setMessage(await result.message);
    }
  };

  let dis = false;
  if (
    email.length !== 0 &&
    password.length > 5 &&
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
  ) {
    dis = true;
  } else {
    dis = false;
  }

  return (
    <div className="grid grid-cols-3 overflow-y-hidden font-snsn bg-[#F0F2F5] h-screen">
      <div className="col-span-2 m-9 ">
        <nav className="flex justify-between font-medium">
          <img src={logo} alt="chory logo " />
          <a href="/signup" className="hover:underline decoration-stone-700">
            Don&apos;t have an account?{" "}
            <span className="text-[#20DC49] font-semibold">Sign up!</span>
          </a>
        </nav>
        <article>
          <section className=" flex justify-center mt-24">
            <div>
              <h2 className=" text-5xl font-semibold">Welcome Back</h2>
              <h4 className="mb-8 text-center my-5 text-2xl">
                Login into your account
              </h4>
            </div>
          </section>
          <section className=" flex justify-center">
            <form
              onSubmit={signIn}
              className=" w-fit  mt-10 flex gap-y-4 flex-col items-center text-left justify-center"
            >
              <div className="mt-2 relative flex justify-center items-center">
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="username"
                  placeholder="Email"
                  className="peer shadow-md sm:w-[21.3rem] h-12 focus:outline-2 focus:outline-stone-500 focus:outline-offset-4 
                            focus:ring-none placeholder-transparent  focus:ring-0  mb-5 w-8/12 rounded-lg px-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label
                  htmlFor="email"
                  className="transition-all absolute left-[3%] eexx:left-[4.75rem] -top-7 text-sm w-fit py-2
                             peer-placeholder-shown:text-base peer-placeholder-shown:top-1 peer-placeholder-shown:text-[#6B7280] peer-focus:-top-7
                             peer-focus:text-sm peer-focus:text-black"
                >
                  Email
                </label>
                <br />
              </div>
              <div className=" mt-2 relative flex justify-center">
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  placeholder="Password"
                  className="peer shadow-md sm:w-[21.3rem] h-12 focus:outline-2 focus:outline-stone-500 focus:outline-offset-4 
                  focus:ring-none placeholder-transparent  focus:ring-0  mb-5 w-8/12 rounded-lg px-2"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label
                  htmlFor="password"
                  className="transition-all absolute left-[3%] eexx:left-[4.75rem] -top-7 text-sm w-fit py-2
                             peer-placeholder-shown:text-base peer-placeholder-shown:top-1 peer-placeholder-shown:text-[#6B7280] peer-focus:-top-7
                             peer-focus:text-sm peer-focus:text-black"
                >
                  Password
                </label>
              </div>
              <button
                className={`sm:w-[21.3rem] w-8/12 rounded-lg border-2 border-stone-600 py-3 hover:bg-[#eeeff0] ${
                  !dis ? "opacity-50 cursor-auto" : "cursor-pointer"
                }`}
                type="submit"
                disabled={!dis}
              >
                Log in
              </button>
              <p className="text-red-600 font-medium text-sm">{mes}</p>
            </form>
          </section>
        </article>
      </div>
      <div className="col-span-1 bg-black flex flex-col justify-around align-bottom">
        <div className="text-white mx-4">
          <h2 className=" text-7xl font-bold ">
            Keep in touch with{" "}
            <span className="text-[#20DC49]">your groups</span>
          </h2>
          <p className=" text-sm opacity-80 w-96 mt-10 ml-2">
            With end-to-end encryption, your personal messages and calls are
            secured. Only you and the person you&apos;re talking to can read or
            listen to them, and nobody in between, not even WhatsApp.
          </p>
          <p className="underline decoration-[#20DC49] underline-offset-4 ml-2 mt-4 opacity-90">
            Learn more &gt;
          </p>
        </div>
        <div className="mx-16 relative">
          <div className="bg-[#20DC49] -bottom-36 -left-44 z-30 blur-3xl opacity-20 rounded-full w-[25rem] h-[25rem] absolute"></div>
          <p className="bg-[#20DC49] w-fit z-10 flex p-4 rounded-xl font-medium">
            <img className="mr-4" src={thmUps} alt="A thumbs up" /> Top Notch
            Stock Resources
          </p>
          <p className="text-white z-50 mt-10 text-lg">
            Today, we create innovative solutions to the challenges that
            consumers face in both their everyday lives and events.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginA;
