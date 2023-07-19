import logo from "../../assets/logo.png";

function Signup() {
  return (
    <header>
      <nav>
        <img src={logo} alt="Our logo" />
      </nav>
      <div>
        <div>
          <a href="/login">
            <span className=" w-5">&lt;</span>Back to login
          </a>
        </div>
        <div></div>
        <div></div>
      </div>
    </header>
  );
}

export default Signup;
