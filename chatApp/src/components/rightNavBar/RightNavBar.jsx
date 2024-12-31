import React from "react";
import assets from "../../assets/assets";
import { logout } from "../../config/firebase.js";
import { AppContext } from "../../context/AppContext.jsx";
import { useContext, useEffect, useState } from "react";

const RightNavBar = () => {
  const { chatUser, messages } = useContext(AppContext);
  const [ imgMessages, setImgMessages ] = useState([]);

  useEffect(() => {
    const imgMessages = messages.map((message) => {return (message.image)});
    setImgMessages(imgMessages);
  }, [messages]);


  return chatUser ? (
    <div className="text-white  bg-slate-800 h-full  w-full overflow-y-scroll min-h-[200px] hidden lg:flex flex-col">
      <div className="pt-16 text-center max-w-[60%] m-auto min-w-1/2">
        <img
          className="rounded-full w-64 aspect-square"
          src={chatUser.avatar}
          alt=""
        />
        <h3 className="text-3xl font-normal flex items-center justify-items-center gap-3 my-3">
          {chatUser.name}{" "}
          {Date.now() - chatUser.lastSeen <= 70000 ?  <img className="rounded-full" src={assets.green_dot} alt="" /> : null}
        </h3>
        <p className="text-sm text-center opacity-50">{chatUser.bio}</p>
      </div>
      <hr className="border-salte-400 w-full my-8" />
      <div className="mx-5 flex-1 gap-2 flex flex-col min-w-1/2">
        <p className="text-lg">Media</p>
        <div className="grid grid-cols-3 gap-2 overflow-y-scroll">
          {imgMessages.map((messageImg, index) => {
            return messageImg ? (
              <img
                className="rounded-lg cursor-pointer w-28 aspect-square"
                src={messageImg}
                alt=""
                key={index} 
                onClick={() => window.open(messageImg)}
              />
            ) : null;
          })}
        </div>
      </div>
      <button
        className="bg-blue-400 px-12 py-2 min-w-1/2 m-auto rounded-3xl mb-4 center cursor-pointer text-xl"
        onClick={() => logout()}
      >
        Logout
      </button>
    </div>
  ) : (
    <div className="text-white  bg-slate-800 h-full w-full overflow-y-scroll min-h-[200px] hidden lg:flex flex-col">
      <button
        className="bg-blue-400 px-12 py-2 min-w-1/2 m-auto rounded-3xl mb-4 center cursor-pointer text-xl"
        onClick={() => logout()}
      >
        Logout
      </button>
    </div>
  );
};

export default RightNavBar;
