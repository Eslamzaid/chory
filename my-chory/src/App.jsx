import { useState, useEffect } from "react";
import { checkIsAuth } from "./utls/func";
import LoadingP from "./components/notLoged/LoadingP";
import { useNavigate } from "react-router-dom";

function App() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await checkIsAuth();
      setAuth(data.success);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (auth === true) {
      navigate("/home");
    } else if (auth === false) {
      navigate("/login");
    }
  }, [auth, navigate]);

  return <>{loading ? <LoadingP /> : null}</>;
}

export default App;
