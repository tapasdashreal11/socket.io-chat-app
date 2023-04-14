import { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    const message = {
      room,
      author: username,
      message: currentMessage,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
    };

    await socket.emit("send_message", message);
    setMessageList((prevMessageList) => [...prevMessageList, message]);
    setCurrentMessage("");
  };

  useEffect(() => {
    socket.on("recieve_message", (payload) => {
      console.log("received from backend", { payload });
      setMessageList((prevMessageList) => [...prevMessageList, payload]);
    });

    return () => socket.removeListener("receive_message");
  }, [socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map(({ message, time, author }) => (
            <div className="message" id={username === author ? "you" : "other"}>
              <div>
                <div className="message-content">{message}</div>
                <div className="message-meta">
                  <p id="time">{time}</p>
                  <p id="author">{author}</p>
                </div>
              </div>
            </div>
          ))}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          placeholder="Hey.."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
