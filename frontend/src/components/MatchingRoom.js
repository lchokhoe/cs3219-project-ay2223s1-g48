import React from "react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useLocation, useNavigate } from "react-router-dom";

const MatchingRoom = () => {
    const [messages, setMessages] = useState("Session started: " + Date().toLocaleString())
    const [question, setQuestion] = useState("dummy question")
    const [input, setInput] = useState('')
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate()
    
    useEffect(() => {
        const socket = io("http://localhost:8081");
        setSocket(socket);
        socket.on("connect", () => {
          console.log(socket.id);
        });
        socket.on("connect_error", () => {
          setTimeout(() => socket.connect(), 8081);
        });
        return () => {
          socket.off("connect");
          socket.off("connect_error");
        };
      }, [setSocket]);
    
    const handleReturn = () => {
        navigate("/matching/" + location.state.username, {
            state: { cookies: location.state.cookies },
          });
    }
    const handleChange = event => {
        setInput(event.target.value);
        // console.log('value is:', event.target.value)
    }
    const handleSend = () => {
        setMessages(messages + "\n" + location.state.username + ": " + input)
        socket.emit("sendMessage", { input: input, roomId: location.state.matchedRoomId });
        setInput('')
    }
    const location = useLocation()
    return (
        <div className="titleandservices">
            <div className="titles">
                <h1>Welcome { location.state.username }, to matching room { location.state.matchedRoomId }!</h1>
                <div className="returnbutton">
                    <button className="returnButton" onClick={() => handleReturn()}>Return</button>
                </div>
            </div>
            <div className="services">
                <div className="collabservice">
                    <textarea className="collab" placeholder="Waiting for coding to start...">
                        
                    </textarea>
                </div>
                <div className="topbottom">
                    <div className="questionservice">
                        <ul className="question">
                            { question }
                        </ul>
                    </div>
                    <div className="communicationservice">
                        <ul className="chatbox">
                            { messages }
                        </ul>
                        <div className="messageinput">
                            <input className="input" type="text" onChange={handleChange} value={input}/><button className="send" onClick={()=>handleSend()}>Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    );
}
 
export default MatchingRoom;