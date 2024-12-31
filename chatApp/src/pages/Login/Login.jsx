import React, { useState } from "react";
import { signUp, login } from "../../config/firebase";
import { resetPass } from "../../config/firebase";

const Login = () => {
  const [userState, setUserState] = useState("Sign up");
  const [bottomText, setBottomText] = useState("Already have an account? ");
  const [buttonText, setButtonText] = useState("Create an account ");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  function handleState() {
    if (userState == "Sign up") {
      setUserState("Login");
      setBottomText("Create an account ");
      setButtonText("Login now");
    } else {
      setUserState("Sign up");
      setBottomText("Already have an account? ");
      setButtonText("Create Account");
    }
  }

  function onSubmitHandler(e) {
    e.preventDefault();
    if (userState == "Sign up") {
      signUp(userName, email, password);
    } else {
      login(email, password);
    }
  }
  return (
    <div className="bg-[url('../../../public/background.png')] flex justify-center items-center min-w-[320px] w-full h-screen overflow-y-auto bg-cover bg-no-repeat flex-wrap p-5 gap-[20%]">
      <div className="flex flex-col items-center justify-items-center">
        <img
          className="object-fill"
          src="../../../public/chat_app.svg"
          alt="logo"
        />
        <p className="text-white text-8xl">Chatapp</p>
      </div>
      <div className="bg-white rounded-xl px-8 py-5 min-h-[0%] flex">
        <div className="flex flex-col flex-grow space-y-[5%]">
          <h2 className="text-3xl">{userState}</h2>
          <form
            className="flex flex-col space-y-[5%] flex-grow"
            onSubmit={onSubmitHandler}
          >
            {userState == "Sign up" ? (
              <input
                className="border h-10 px-2 rounded-l border-gray-900 flex-grow"
                type="text"
                placeholder="username"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
                value={userName}
              />
            ) : null}
            <input
              className="border min-h-10 px-2 rounded-l border-gray-900 flex-grow"
              type="email"
              placeholder="Email address"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              value={email}
            />
            <input
              className="border min-h-10 px-2 rounded-l border-gray-900 flex-grow"
              type="password"
              placeholder="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <button
              className="bg-blue-500 text-white font-bold min-h-10 py-2 rounded-l flex-grow"
              type="submit"
            >
              {buttonText}
            </button>
          </form>
          <div className="flex gap-x-2 content-center">
            <input type="checkbox" />
            <p className="text-gray-900">
              Agree to the terms of use & privacy policy.
            </p>
          </div>
          <div className="flex flex-col gap-y-2 flex-grow">
            <div>
              <label className="text-gray-900">{bottomText} </label>
              <button
                onClick={() => handleState()}
                className="text-blue-500 text-l"
              >
                Click here
              </button>
            </div>
            {userState == "Sign up" ? null : (
              <div>
                <label className="text-gray-900">Forgot Password ? </label>
                <button
                  onClick={() => resetPass(email)}
                  className="text-blue-500 text-l"
                >
                  Reset here
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Login;
