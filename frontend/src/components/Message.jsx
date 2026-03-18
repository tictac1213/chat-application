import { memo } from "react";
import { useAuth } from "../context/AuthContext";


function Message({ message }){
    const { user } = useAuth();
    // console.log(user);
    
    const isOwn = message.senderId._id.toString() === user.id.toString();
//    console.log(message.senderId);
   
    const date = new Date(message.createdAt);
    const time = date.toLocaleTimeString(undefined,{
        hour: '2-digit',
        minute: '2-digit',
        hourCycle: 'h23'
    });
    return (
        <div className={`flex ${isOwn ? "justify-end" : "justify-start"} `}>
            <div
                className={`px-2 py-1 rounded-lg max-w-xs ${ isOwn ? "bg-blue-400" : "bg-blue-900"} text-white`}
            >
                <div className="text-s text-green-600">
                    {message.senderId.username}
                </div>
                <div className="text-lg p-1">
                    {message.content}
                </div>
                <div className="text-right text-[10px]">{time}</div>
            </div> 
        </div>
    );
}

export default memo(Message);