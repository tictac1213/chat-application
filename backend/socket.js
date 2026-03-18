import jwt from 'jsonwebtoken';
import Message from './models/message.model.js';
import Conversation from './models/conversation.model.js';


const onlineUsers = new Map();

export default function initSocket(io){
    io.on("connection", (socket) => {
        console.log("New socket connected: ", socket.id);

        socket.on("authenticate", (token) => {  
            try{
                const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
                socket.userId = decoded.id;

                if(!onlineUsers.has(socket.userId)) {
                    onlineUsers.set(socket.userId, new Set());
                }

                onlineUsers.get(socket.userId).add(socket.id);

                // report online
                io.emit("online_users", Array.from(onlineUsers.keys()));
                console.log("User connected: ", socket.userId);
                
                
            }
            catch(error){
                console.log("invalid token.");
                socket.disconnect();
                
            }
        });
        
        // -- Join Conversation --
        socket.on("join_conversation", async (conversationId) => {
            if(!socket.userId)
                return;
            
            const conv = await Conversation.findOne({
                _id: conversationId,
                members: socket.userId
            });
            
            if(!conv)
                return;
            
            if (!socket.rooms.has(conversationId)) {
                socket.join(conversationId);
                console.log(`User ${socket.userId} joined room ${conversationId}`);
            }
            else{
                console.log(`User ${socket.userId} already in room ${conversationId}`);
            }
            
        });
        
        
        
        // -- Send Message --
        socket.on("send_message", async({conversationId, content, type}) => {
            try{
                if(!socket.userId)
                    return;
                
                if (!content || !conversationId) 
                    return;

                const conv = await Conversation.findOne({
                    _id: conversationId,
                    members: socket.userId
                });
                
                if(!conv)
                    return;
                
                const newMessage = await Message.create({
                    senderId: socket.userId,
                    conversationId,
                    content,
                    type  
                });
                
                conv.lastMessage = {
                    content: newMessage.content,
                    senderId: socket.userId,
                    messageType: newMessage.type,
                    createdAt: newMessage.createdAt
                }
                
                await conv.save();
                
                const populatedMessage = await Message.findById(newMessage._id).populate("senderId", "username");

                io.to(conversationId).emit("receive_message", populatedMessage);
                
            }
            catch(error){
                console.log("send_message error: ", error);
                
            }
            
        });
        
        
        //  -- Disconnect -- 
        
        socket.on("disconnect", () => {
            if(!socket.userId)
                return;
            
            const set = onlineUsers.get(socket.userId);
            
            if(set) {
                set.delete(socket.id)
                
                if(set.size === 0){
                    onlineUsers.delete(socket.userId);
                    console.log("User offline:", socket.userId);

                    // ubdate online users
                    io.emit("online_users", Array.from(onlineUsers.keys()));
                    
                }
            }

        });

        // Typing
        socket.on("typing_start", ( {conversationId} ) => {
            // console.log('rr');
            socket.to(conversationId).emit("user_typing", {
                userId: socket.userId
            })
        })
        socket.on("typing_stop", ({conversationId}) => {
            // console.log('rr2');
            socket.to(conversationId).emit("user_stop_typing", {
                userId: socket.userId
            })
        })


    });


}