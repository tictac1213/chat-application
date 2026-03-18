import { useEffect, useState } from "react";

import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import axios from "../api/axios";
import { getSocket } from "../socket/socket";




export default function Chat(){
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);


    // others typing
    const [typingUsers, setTypingUsers] = useState(new Set());


    // Fetch conversations
    useEffect(() =>{
        const fetchConversations = async () => {
            try{
                const res = await axios.get("/conversation/me");
                setConversations(res.data.conversations);
                // console.log(res);
                
            }
            catch(error){
                console.log("Error fetching conversations: ", error);
            }
        }

        fetchConversations();

    },[]);


    // Select conversations and send message
    useEffect(() => {
        if(!selectedConversation)
            return;

        setCursor(null);
        setHasMore(true);
        const fetchMessages = async() => {
            try{
                const res = await axios.get(`/message/conversation/${selectedConversation._id}/messages`);

                // console.log(res.data);
                setMessages(res.data.messages);

                if(!res.data.nextCursor){
                    setHasMore(false);

                }
                else{
                    setCursor(res.data.nextCursor);
                }
            }
            catch(error){
                console.log("Error fetching messages: ", error);
                
            }
        }

        // console.log(selectedConversation);
        
        const socket = getSocket();
        if(!socket)
            return;

        socket.emit("join_conversation", selectedConversation._id);

        fetchMessages();

    }, [selectedConversation]);


    const sendMessage = async (content) => {
        if(!selectedConversation)
            return;

        const socket = getSocket();
        if(!socket)
            return;

        socket.emit("send_message", {
            conversationId: selectedConversation._id,
            content,
            type: "text"
        });
    }


    // recieve message 
    useEffect(() => {
        const socket = getSocket();

        if(!socket)
            return;

        const handleMessage = (msg) => {
            if (!selectedConversation) 
                return;
            // console.log("recieved: " + msg);
            if (msg.conversationId.toString() !== selectedConversation._id.toString()) 
                return;

            setMessages((prev) => [...prev,msg]);
        }

        socket.on("receive_message", handleMessage);

        return () => {
            socket.off("receive_message", handleMessage);
        }

    }, [selectedConversation]);


    // typing indicator
    useEffect(() => {
               // typing
        // setTyping(false);
        setTypingUsers(new Set());

        const socket = getSocket();

        const handleTyping = ({ userId }) => {
            // ! not like this setTypingUsers(prev => prev.add(id));
            // console.log(userId);
            // console.log("event recieved");
            
            setTypingUsers(prev => new Set([...prev, userId]));
        }
        
        const handleStopTyping = ({ userId }) => {
            
            setTypingUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }

        socket.on("user_typing",handleTyping);

        socket.on("user_stop_typing", handleStopTyping);
        
        return () => {
            socket.off("user_typing", handleTyping);
            socket.off("user_stop_typing", handleStopTyping);
        }

    }, [selectedConversation]);


    // Load Older messages
    const loadOlderMessages = async () => {

        if(!cursor || loadingOlderMessages)
            return;
        setLoadingOlderMessages(true);

        const res = await axios.get(
            `/message/conversation/${selectedConversation._id}/messages?before=${cursor}`
        );

        const older = res.data.messages;
        setMessages(prev => [...older,...prev]);

        setCursor(res.data.nextCursor);

        if(!res.data.nextCursor){
            setHasMore(false);
        }   

        setLoadingOlderMessages(false);
    }



    return (
        <div className="h-screen flex bg-gray-900 text-white">
            <div className=" border-r-gray-800">

            </div>

            {/* Sidebar */}
            <div className="w-80 border-r border-gray-800 ">
                <Sidebar
                    selectedConversation={selectedConversation}
                    setSelectedConversation={setSelectedConversation}
                    conversations={conversations}
                />
            </div>

            {/* Chat Window */}
            <div className="flex-1">
                <ChatWindow conversation={selectedConversation} messages={messages} sendMessage={sendMessage} loadOlderMessages={loadOlderMessages} hasMore={hasMore} loadingOlderMessages = {loadingOlderMessages} typingUsers={typingUsers} />
            </div>

        </div>
    )
}