import { useState } from "react";
import logo from "../../assets/logo.png";

function LoginA() {
  const signIn = (e) => {
    e.preventDefault();
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="grid grid-cols-3 font-snsn bg-[#F0F2F5] h-screen">
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
              <h4 className="text-center my-5 text-2xl">
                Login into your account
              </h4>
              <div>psspowrt</div>
              <div className="border-b border-slate-300 text-center">
                <span className=" relative top-3 bg-[#F0F2F5] p-3">
                  or continue with
                </span>
              </div>
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
                className=" sm:w-[21.3rem] w-8/12 rounded-lg border-2 border-stone-600 py-3 hover:bg-[#eeeff0]"
                type="submit"
                // onClick={notify2}
              >
                Log in
              </button>
            </form>
          </section>
        </article>
      </div>
      <div className=" col-span-1 bg-black"></div>
    </div>
  );
}

export default LoginA;
