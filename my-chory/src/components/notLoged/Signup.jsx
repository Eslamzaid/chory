import { useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import lessThan from "../../assets/lessThan.png";
import { checkIsAuth } from "../../utls/func";

function Signup() {
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [state, setState] = useState(false);
  const [mes, setMes] = useState("");

  const checkTrue = () => {
    if (name.length < 2 && name.length !== 0) {
      setMes("Name is too short (it should be at least 2 characters)");
    } else if (name.length === 0) {
      setMes("Name is missing");
    } else if (username.length < 4 && username.length !== 0) {
      setMes("Username is too short (it should be at least 4 characters)");
    } else if (username.length === 0) {
      setMes("Username is missing");
    } else if (phone.length < 7 && phone.length !== 0) {
      setMes("Phone number is too short (it should be at least 7 characters)");
    } else if (phone.length === 0) {
      setMes("Phone number is missing");
    } else if (bio.length === 0) {
      setMes("Bio is missing");
    } else if (bio.length < 15) {
      setMes(
        "Bio should be at most 200 or at least 15 characters ( you just typed " +
          bio.length +
          " characters )"
      );
    } else if (!email.includes("@") || email.length < 5) {
      setMes("Invalid email address");
    } else if (password.length === 0) {
      setMes("Password is missing");
    } else if (password.length < 6 && password.length !== 0) {
      setMes("Password is too short (it should be at least 6 characters)");
    } else {
      setMes("");
      setState(true);
      // All checks pass, you can proceed with the registration logic here.
      // For example, you can submit the form or call an API to save the data.
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
  };

  return (
    <section className="m-8 font-snsn">
      <nav className="">
        <img src={logo} alt="Our logo" />
      </nav>
      <section className="flex flex-col items-center justify-center mt-10">
        <div className="w-7/12">
          {" "}
          <a href="/login" className=" flex items-center">
            <span className="w-5">
              <img src={lessThan} alt="go to login in" />
            </span>
            Back to login
          </a>
        </div>
        <div className="w-full text-center">
          <h1 className="text-4xl font-semibold mt-10">Sign up!</h1>
          <h3 className="text-center text-xl my-6">Create your free account</h3>
        </div>
        <form onSubmit={submitForm}>
          <div className="grid grid-cols-2 gap-x-10">
            <div>
              <div className="mt-2 relative flex justify-center items-center">
                <input
                  type="text"
                  minLength="2"
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Name"
                  className="peer shadow-md sm:w-[21.3rem] h-12 focus:outline-2 focus:outline-stone-500 focus:outline-offset-4 
                            focus:ring-none placeholder-transparent  focus:ring-0  mb-5 w-8/12 rounded-lg px-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <label
                  htmlFor="name"
                  className="transition-all absolute left-[3%] eexx:left-[4.75rem] -top-7 text-sm w-fit py-2
                             peer-placeholder-shown:text-base peer-placeholder-shown:top-1 peer-placeholder-shown:text-[#6B7280] peer-focus:-top-7
                             peer-focus:text-sm peer-focus:text-black"
                >
                  Name
                </label>
                <br />
              </div>
              <div className="mt-2 relative flex justify-center items-center">
                <input
                  type="tel"
                  minLength="7"
                  id="phone"
                  name="phone"
                  autoComplete="phone"
                  placeholder="Phone"
                  className="peer shadow-md sm:w-[21.3rem] h-12 focus:outline-2 focus:outline-stone-500 focus:outline-offset-4 
                            focus:ring-none placeholder-transparent  focus:ring-0  mb-5 w-8/12 rounded-lg px-2"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <label
                  htmlFor="phone"
                  className="transition-all absolute left-[3%] eexx:left-[4.75rem] -top-7 text-sm w-fit py-2
                             peer-placeholder-shown:text-base peer-placeholder-shown:top-1 peer-placeholder-shown:text-[#6B7280] peer-focus:-top-7
                             peer-focus:text-sm peer-focus:text-black"
                >
                  Phone
                </label>
                <br />
              </div>
              <div className="mt-2 relative flex justify-center items-center">
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
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
            </div>
            <div>
              <div className="mt-2 relative flex justify-center items-center">
                <input
                  type="text"
                  id="username"
                  minLength="4"
                  name="username"
                  autoComplete="username"
                  placeholder="username"
                  className="peer shadow-md sm:w-[21.3rem] h-12 focus:outline-2 focus:outline-stone-500 focus:outline-offset-4 
                            focus:ring-none placeholder-transparent  focus:ring-0  mb-5 w-8/12 rounded-lg px-2"
                  value={username}
                  onChange={(e) => setUserName(e.target.value)}
                />
                <label
                  htmlFor="username"
                  className="transition-all absolute left-[3%] eexx:left-[4.75rem] -top-7 text-sm w-fit py-2
                             peer-placeholder-shown:text-base peer-placeholder-shown:top-1 peer-placeholder-shown:text-[#6B7280] peer-focus:-top-7
                             peer-focus:text-sm peer-focus:text-black"
                >
                  username
                </label>
                <br />
              </div>
              <div className="mt-2 relative flex justify-center items-center">
                <input
                  type="text"
                  id="bio"
                  minLength="15"
                  name="bio"
                  autoComplete="Bio"
                  placeholder="Bio"
                  className="peer shadow-md sm:w-[21.3rem] h-12 focus:outline-2 focus:outline-stone-500 focus:outline-offset-4 
                            focus:ring-none placeholder-transparent  focus:ring-0  mb-5 w-8/12 rounded-lg px-2"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <label
                  htmlFor="bio"
                  className="transition-all absolute left-[3%] eexx:left-[4.75rem] -top-7 text-sm w-fit py-2
                             peer-placeholder-shown:text-base peer-placeholder-shown:top-1 peer-placeholder-shown:text-[#6B7280] peer-focus:-top-7
                             peer-focus:text-sm peer-focus:text-black"
                >
                  Bio
                </label>
                <br />
              </div>
              <div className="mt-2 relative flex justify-center items-center">
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="Password"
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
                <br />
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              className={`w-10/12 mt-10 rounded-lg border-2 border-stone-600 py-3 hover:bg-[#eeeff0] ${"cursor-pointer"}`}
              type={state ? "submit" : "button"}
              // disabled={email}
              onClick={checkTrue}
            >
              Log in
            </button>
            <p>{mes}</p>
          </div>
        </form>
      </section>
    </section>
  );
}

export default Signup;
