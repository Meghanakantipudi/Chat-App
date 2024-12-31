import React from "react";
import assets from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { useContext, useState, useEffect } from "react";
import { collection, query, where, getDocs, setDoc, updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { toast } from "react-toastify";
import { serverTimestamp, arrayUnion } from "firebase/firestore";

const LeftNavBar = () => {
  const navigate = useNavigate();
  const { userData, chatData, setMessages, setMessagesId, setChatUser, messagesId, chatVisible, setChatVisible, chatUser } = useContext(AppContext);
  const [ searchUserData, setSearchUserData ] = useState(null);
  const [ showSearchValue, setShowSearchValue ] = useState(false);

  const searchHandler = async (e) => {
    try {
      const searchValue = e.target.value;
      if (searchValue) {
        setShowSearchValue(true);
        const q = query(
          collection(db, "users"),
          where("username", "==", searchValue.toLowerCase())
        );
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty && querySnapshot.docs[0].data().id !== userData.id) {
          let userExists = false;
          chatData.forEach((chatItem) => {
            if(chatItem.rId === querySnapshot.docs[0].data().id) {
              userExists = true;
              setSearchUserData(null);
            }
          });
          if(!userExists) setSearchUserData(querySnapshot.docs[0].data());
        } else {
          setSearchUserData(null);
        }
      } else {
        setShowSearchValue(false);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const addChatData = async () => {
    try {
      const messageRef = collection(db, "messages");
      const chatRef = collection(db, "chats");
      const newMessageRef = doc(messageRef);
      await setDoc(newMessageRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(chatRef, userData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: searchUserData.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      });

      await updateDoc(doc(chatRef, searchUserData.id), {
        chatsData: arrayUnion({
          messageId: newMessageRef.id,
          lastMessage: "",
          rId: userData.id,
          updatedAt: Date.now(),
          messageSeen: true
        })
      });

      const searchUserSnap = await getDoc(doc(db, "users", searchUserData.id));
      const searchUserData1 = searchUserSnap.data();
      setChat({
        messageId: newMessageRef.id,
        rData: searchUserData1
      })
      setShowSearchValue(false);
      setChatVisible(true);

    }
    catch (error) {
      toast.error(error.message);
    }

  };

  const setChat = async(item) => {
    try{
      setMessagesId(item.messageId);
      setChatUser(item.rData);

      const chatRef = doc(db, "chats", userData.id);
      const chatSnap = await getDoc(chatRef);
      const data = chatSnap.data().chatsData;
      const index = data.findIndex((chatItem) => chatItem.messageId === item.messageId);
      data[index].messageSeen = true;
      await updateDoc(chatRef, {
        chatsData: data
      });
      setChatVisible(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const updateChatUserData = async () => {
      try{
        if(chatUser){
          const chatRef = doc(db, "chats", userData.id);
          const chatSnap = await getDoc(chatRef);
          const userData1 = chatSnap.data().chatsData;
          setChatUser(prev => ({...prev, userData: userData1}));
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
    updateChatUserData();

  }, [chatData])
  return (
    <div className={`bg-slate-800 w-full p-7 space-y-8 h-full overflow-y-auto ${chatVisible ? 'hidden lg:flex flex-col': 'flex flex-col'}`}>
      <div className="flex justify-between items-center">
        <img className="max-w-60 max-h-10" src={assets.logo} alt="logo" />
        <div className="relative group py-2">
          <img className="max-h-6" src={assets.menu_icon} alt="menu" />
          <div className="p-4 border-gray-300 bg-white rounded-xl m-2 text-black text-lg absolute min-w-36 right-0 group-hover:block hidden">
            <p className="cursor-pointer" onClick={() => navigate("/profile")}>
              Edit Profile
            </p>
            <hr className="border-black w-full my-3" />
            <p className="cursor-pointer">Logout</p>
          </div>
        </div>
      </div>
      <div className="flex flex-cols bg-blue-900 p-4 items-center max-h-11 rounded-l">
        <img
          className="max-h-6 pr-2"
          src={assets.search_icon}
          alt="search_icon"
        />
        <input
          className="bg-blue-900 w-full placeholder:text-white-400 text-white p-1"
          type="text"
          placeholder="Search here..."
          onChange={searchHandler}
        />
      </div>
      <div className="flex flex-col h-[80%] overflow-y-scroll gap-5">
        {showSearchValue && searchUserData ? (
          <div className="flex items-center gap-5 hover:bg-sky-700" onClick={addChatData}>
            <img
              className="w-[45px] rounded-3xl aspect-[1/1]"
              src={searchUserData.avatar}
              alt=""
            />
            <div className="flex flex-col text-white text-lg group hover:text-white">
              <p>{searchUserData.name}</p>
              <span className="text-sm text-gray-400 group-hover:text-inherit">
                {}
              </span>
            </div>
          </div>
        ) : (
          chatData && 
          chatData.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center gap-5 hover:bg-sky-700"
                  onClick={() => setChat(item)}
                >
                  <img
                    className={` w-[45px] rounded-3xl aspect-[1/1] ${
                      !item.messageSeen ? 'border-sky-500 border-4' : ""
                    }`}
                    src={item.rData.avatar}
                    alt=""
                  />
                  <div className="flex flex-col text-white text-lg group hover:text-white">
                    <p>{item.rData.name}</p>
                    <span className={` text-sm text-gray-400 group-hover:text-inherit ${!item.messageSeen ? 'text-sky-500' : ''}`}>
                      {item.lastMessage}
                    </span>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
};

export default LeftNavBar;
