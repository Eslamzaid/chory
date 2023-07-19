import { login } from "../../utls/func.js";
import { useEffect } from "react";

function LoginA() {
  const logInFunction = async () => {
    const response = await login();
    const data = response.hi;
    console.log(data);
    return data;
  };

  useEffect(() => {
    logInFunction();
  }, []);

  return <div>LoginA</div>;
}

export default LoginA;
