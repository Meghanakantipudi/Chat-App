import { createContext, useState } from "react";
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth } from "../config/firebase";
import { useEffect } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [userData, setUserData] = useState(null);
  const [chatData, setChatData] = useState(null);
  const [messagesId, setMessagesId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatUser, setChatUser] = useState(null);
  const [chatVisible, setChatVisible] = useState(false);

  const navigate = useNavigate();

  const loadUserData = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData1 = userDocSnap.data();
        setUserData(userData1);
        if (userData1.avatar && userData1.name) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }

        await updateDoc(userDocRef, {
          lastSeen: Date.now(),
        });

        setInterval(async () => {
          if (auth.currentUser) {
            await updateDoc(userDocRef, {
              lastSeen: Date.now(),
            });
          }
        }, 60000);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    try {
      if (userData) {
        const chatDocRef = doc(db, "chats", userData.id);
        const unSub = onSnapshot(chatDocRef, async (chatDoc) => {
          const chatItems = chatDoc.data().chatsData;
          const tempData = [];
          for (const item of chatItems) {
            const rDocRef = doc(db, "users", item.rId);
            const rDocSnap = await getDoc(rDocRef);
            const rData = rDocSnap.data();
            tempData.push({ ...item, rData });
          }
          setChatData(tempData.sort((a, b) => b.updateAt - a.updatedAt));
        });
        return () => {
          unSub();
        };
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [userData]);

  const value = {
    userData,
    setUserData,
    chatData,
    setChatData,
    loadUserData,
    messagesId,
    setMessagesId,
    messages,
    setMessages,
    chatUser,
    setChatUser,
    chatVisible,
    setChatVisible
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
