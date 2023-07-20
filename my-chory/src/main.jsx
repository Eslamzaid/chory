import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import LoginA from "./components/notLoged/LoginA.jsx";
import Signup from "./components/notLoged/Signup.jsx";
import Chatting from "./components/loged/chatting.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/login",
    element: <LoginA />,
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "/home",
    element: <Chatting />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(  
  <RouterProvider router={router} />
);
