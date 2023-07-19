import { useState, useEffect } from "react";
import { checkIsAuth } from "./utls/func";
import LoginA from "./components/notLoged/LoginA";
import LoadingP from "./components/notLoged/LoadingP"

function App() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await checkIsAuth();
      setAuth(data.success);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <>
      {loading ? (
        <LoadingP />
      ) : auth ? (
        "chatting"
      ) : (
        <LoginA />
      )}
    </>
  );
}

export default App;
