import { useState, useRef } from "react";
import { getSocket } from "../socket/socket";



export default function InputBox({sendMessage, conversationId}){
    const [text, setText] = useState("");
    const typingTimer = useRef(null);

    const handleSend = async () => {
        if(!text.trim())
            return;
        console.log("Sending: ", text);
        
        sendMessage(text);

        setText("");
    }
    
    
    
    const typingStop = () => {
        clearTimeout(typingTimer.current);
        typingTimer.current = null;
        const socket = getSocket();
        socket.emit("typing_stop",{
            conversationId
        })
    };

    const handleInput = (e) => {
        setText(e.target.value);
        if(typingTimer.current !== null ){ 
            clearTimeout(typingTimer.current);
            typingTimer.current = setTimeout(typingStop, 3000);
            return;
        }
    
        typingTimer.current = setTimeout(typingStop, 3000);
        const socket = getSocket();
        // console.log('typing msg');
        
        socket.emit("typing_start",{
            conversationId
        })

    }

    return (
        <div className="p-4 border-t border-gray-800 bg-gray-800 flex gap-2">
            <input 
                className="flex-1 p-2 rounded bg-gray-700 text-white"
                placeholder="Type here..."
                value={text}
                onChange={handleInput}
            />
            <button 
                onClick={handleSend}
                className="bg-blue-500 px-4 rounded hover:bg-blue-600"
            >
                Send
            </button>
        </div>
    )

}