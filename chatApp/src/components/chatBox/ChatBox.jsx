import React from "react";
import assets from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  doc,
  arrayUnion,
  getDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import upload from "../../lib/upload";

const ChatBox = () => {
  const {
    messages,
    setMessages,
    messagesId,
    setMessagesId,
    chatUser,
    setChatUser,
    userData,
    chatVisible,
    setChatVisible
  } = useContext(AppContext);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    try {
      if (input && messagesId) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            message: input,
            createdAt: new Date(),
          }),
        });

        const userIds = [userData.id, chatUser.id];

        userIds.forEach(async (id) => {
          const chatRef = doc(db, "chats", id);
          const chatSnap = await getDoc(chatRef);
          if (chatSnap.exists()) {
            const chatsData = chatSnap.data().chatsData;
            const index = chatsData.findIndex(
              (item) => item.messageId === messagesId
            );
            chatsData[index].lastMessage = input.slice(0, 30);
            chatsData[index].updateAt = Date.now();
            if (chatsData[index].rId == userData.id) {
              chatsData[index].messageSeen = false;
            }

            await updateDoc(chatRef, {
              chatsData: chatsData,
            });
          }
        });
      }
      setInput("");
    } catch (error) {
      console.log(error);
      toast(error.message);
    }
  };

  useEffect(() => {
    if (messagesId) {
      const unsub = onSnapshot(doc(db, "messages", messagesId), (res) => {
        if (res.exists()) {
          setMessages(res.data().messages.reverse());
        }
      });

      return () => unsub();
    }
  }, [messagesId]);

  const translateToTime = (timeStamp) => {
    const hours = timeStamp.toDate().getHours();
    const minutes = timeStamp.toDate().getHours();
    if (hours > 12) {
      return `${hours - 12}:${minutes} PM`;
    } else {
      return `${hours}:${minutes} AM`;
    }
  };

  const sendImage = async (e) => {
    try {
      const imgUrl = await upload(e.target.files[0]);

      if (messagesId && imgUrl) {
        await updateDoc(doc(db, "messages", messagesId), {
          messages: arrayUnion({
            sId: userData.id,
            image: imgUrl,
            createdAt: new Date(),
          }),
        });

        const userIds = [userData.id, chatUser.id];

        userIds.forEach(async (id) => {
          const chatRef = doc(db, "chats", id);
          const chatSnap = await getDoc(chatRef);
          if (chatSnap.exists()) {
            const chatsData = chatSnap.data().chatsData;
            const index = chatsData.findIndex(
              (item) => item.messageId === messagesId
            );
            chatsData[index].lastMessage = "Image";
            chatsData[index].updateAt = Date.now();
            if (chatsData[index].rId == userData.id) {
              chatsData[index].messageSeen = false;
            }

            await updateDoc(chatRef, {
              chatsData: chatsData,
            });
          }
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return chatUser ? (
    <div className={`${chatVisible ? 'flex flex-col w-full h-full overflow-auto' : 'hidden'} lg:flex flex-col w-full h-full overflow-auto`}>
      <div className="flex w-full items-center p-3">
        <div className="flex flex-1 gap-4 items-center">
          <img
            className="w-[60px] h-[60px] rounded-full"
            src={chatUser.avatar}
            alt="profile Image"
          />
          <p className="text-3xl text-gray-700">{chatUser.name}</p>
          {Date.now() - chatUser.lastSeen <= 70000 ? <img src={assets.green_dot} alt="Green Dot" /> : null }
        </div>
        <img className="w-8 h-8 curosor-pointer hidden lg:block" src={assets.help_icon} alt="Info Icon" />
        <img className="w-8 h-8 curosor-pointer lg:hidden" src={assets.arrow_icon} alt="Back Icon" onClick={() => setChatVisible(false)}/>
      </div>
      <hr className="border-gray-300" />
      <div className="flex flex-col-reverse h-[calc(100%-70px)] mx-1 my-3 overflow-y-scroll gap-3">
        {messages.map((item, index) => {
          return item.sId === userData.id ? (
            <div key={index} className="flex gap-3 flex-row-reverse items-end">
              <div className="flex flex-col items-center">
                <img
                  className="w-8 rounded-full"
                  src={userData.avatar}
                  alt=""
                />
                <p className="text-xs/6 text-gray-600">
                  {translateToTime(item.createdAt)}
                </p>
              </div>
              {item.image ? (
                <img
                  className="rounded-lg max-w-80 mb-10 cursor-pointer"
                  src={item.image}
                  alt="Picture"
                />
              ) : (
                <p className="bg-blue-400 p-[8px] rounded-lg rounded-br-none max-w-72 text-white text-s mb-10">
                  {item.message}
                </p>
              )}
            </div>
          ) : (
            <div key={index} className="flex gap-3 items-end">
              <div className="flex flex-col items-center">
                <img
                  className="w-8 rounded-full"
                  src={chatUser.avatar}
                  alt=""
                />
                <p className="text-xs/6 text-gray-600">
                  {translateToTime(item.createdAt)}
                </p>
              </div>
              {item.image ? (
                <img
                  className="rounded-lg max-w-80 mb-10 cursor-pointer"
                  src={item.image}
                  alt="Picture"
                />
              ) : (
                <p className="bg-blue-400 p-[8px] rounded-lg rounded-br-none max-w-72 text-white text-s mb-10">
                  {item.message}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex bg-white rounded-xl items-center p-2 gap-2">
        <input
          className="flex-1"
          type="text"
          placeholder="Send a message"
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <label htmlFor="image">
        <input
          type="file"
          id="image"
          name="image"
          accept=".png .jpeg .jpg"
          className="hidden"
          onChange={sendImage}
        />
        <img
          className="w-8 cursor-pointer"
          src={assets.gallery_icon}
          alt=""
        />
        </label>
        <img
          className="w-8 cursor-pointer"
          src={assets.send_button}
          alt=""
          onClick={sendMessage}
        />
      </div>
    </div>
  ) : (
    <div className='hidden lg:flex flex-col items-center justify-center gap-2'>
      <img className="w-32" src={assets.logo_icon}></img>
      <p className="text-xl text-gray-400 font-medium">
        Chat, Any time, Any where
      </p>
    </div>
  );
};

export default ChatBox;
