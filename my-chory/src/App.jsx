import { useEffect } from "react";
import { checkIsAuth } from "./utls/func";
import LoginA from "./components/notLoged/LoginA";


function App() {
  let auth = null;
  const checking = async () => {
    const data = await checkIsAuth();
    auth = data.success;
  };

  useEffect(() => {
    checking();
  });
  return <>{auth ? "Chatting" : <LoginA />}</>;
}

export default App;
