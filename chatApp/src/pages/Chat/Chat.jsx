import ChatBox from "../../components/chatBox/ChatBox";
import LeftNavBar from "../../components/leftNavBar/LeftNavBar";
import RightNavBar from "../../components/rightNavBar/RightNavBar";

const Chat = () => {
  return (
    <div className="bg-blue-500 bg-cover w-screen h-screen flex justify-center items-center min-w-[320px]">
      <div className={`grid grid-cols-[1fr] lg:grid-cols-[1fr_2fr_1fr] bg-blue-50 h-[75vh] w-[75%] place-items-center`}>
        <LeftNavBar />
        <ChatBox />
        <RightNavBar />
      </div>
    </div>
  );
};

export default Chat;
