import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Messages.css"

export default function Chat({ userId }) {
  const [recentChats, setRecentChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const intervalRef = useRef(null);

  const fetchRecentChats = () => {
    axios.get(`/messages/recent?user_id=${userId}`)
      .then(res => setRecentChats(res.data.recentChats))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchRecentChats();
  }, [userId]);

  const fetchMessages = () => {
    if (!activeChat) return;
    axios.get(`/messages?sender_id=${userId}&receiver_id=${activeChat.partner_id}`)
      .then(res => setMessages(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    clearInterval(intervalRef.current);
    if (activeChat) {
      fetchMessages(); // initial load
      intervalRef.current = setInterval(fetchMessages, 2000);
    }
    return () => clearInterval(intervalRef.current);
  }, [activeChat]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    axios.post("/messages", {
      sender_id: userId,
      receiver_id: activeChat.partner_id,
      content: newMessage
    })
    .then(() => {
      setMessages(prev => [...prev, { sender_id: userId, content: newMessage }]);
      setNewMessage("");
      fetchRecentChats(); 
    })
    .catch(err => console.error(err));
  };

  return (
    <div className="chat-container">
      {/* Recent Chats */}
      <div className="recent-chats">
        <h3 className="recent-chats-title">Recent Chats</h3>
        {recentChats.map(chat => (
          <div 
            key={chat.partner_id} 
            className="recent-chat-item"
            onClick={() => setActiveChat(chat)}
          >
            <img src={chat.partner_picture} alt="" className="recent-chat-img" />
            <div className="recent-chat-info">
              <span className="recent-chat-name">{chat.partner_name}</span>
              <p className="recent-chat-last-message">{chat.last_message}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Active Chat */}
      <div className="active-chat">
        {activeChat ? (
          <>
            <h3 className="active-chat-title">Chat with {activeChat.partner_name}</h3>
            <div className="messages-container">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`message-item ${msg.sender_id === userId ? "sent" : "received"}`}
                >
                  {msg.content}
                </div>
              ))}
            </div>
            <div className="message-input-container">
              <input 
                type="text" 
                value={newMessage} 
                onChange={e => setNewMessage(e.target.value)} 
                placeholder="Type a message..." 
                className="message-input"
              />
              <button onClick={sendMessage} className="send-message-btn">Send</button>
            </div>
          </>
        ) : (
          <p className="no-chat-selected">Select a chat to start messaging</p>
        )}
      </div>
    </div>
  );
}
