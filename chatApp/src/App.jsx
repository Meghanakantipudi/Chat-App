import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Chat from "./pages/chat/chat";
import Login from "./pages/login/login";
import Profile from "./pages/profile/profile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AppContext } from "./context/AppContext";
import { useContext, useEffect } from "react";

const App = () => {

  const { loadUserData } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        await loadUserData(user.uid);
      }
      else  {
        navigate("/");
      }
    })
  }, []);

  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

export default App;
