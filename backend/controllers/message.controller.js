import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";



export async function sendMessage(req, res){
    try {
        
        const { conversationId, content, type} = req.body;
        const user = req.user;
        
        const check = await Conversation.findOne({
            _id : conversationId,
            members: {$in: [user.id]}
        });

        if(!check){
            return res.status(403).json({
                msg: 'Unauthorized access'
            });
        }


        const newMessage = await Message.create({
            senderId: user.id,
            conversationId: conversationId,
            content: content,
            type: type
        });

        check.lastMessage = {
            content: content,
            senderId: user.id,   
            messageType: type,
            createdAt: newMessage.createdAt
        };

        console.log(check.lastMessage);
        
        await check.save();

        return res.status(201).json({
            success: true,
            message: newMessage
        })
        
    } 
    catch(error) {

        console.log(`Error sending message: ${error}`);
        
        return res.status(503).json({
            msg: "Internal server error."
        });
    }
    
    
}


export async function getConversationMessages(req, res){

    try{

        const conversationId = req.params.conversationId;
        const user = req.user;
        const before = req.query.before;
        
        const check = await Conversation.findOne({
            _id : conversationId,
            members: {$in: [user.id]}
        });

        if(!check){
            return res.status(403).json({
                msg: 'Unauthorized access'
            });
        }
        
        const query =  { conversationId };

        if(before){
            query.createdAt = { $lt: new Date(before)};
        }

        let messages = await Message.find(query)
        .select("senderId content type createdAt")
        .sort({createdAt: -1})
        .limit(20)
        .populate("senderId","username");

        messages = messages.reverse();
        const nextCursor = messages.length > 0 ? messages[0].createdAt : null;


        return res.status(200).json({
            success: true,
            messages,
            nextCursor
        })
        
    }
    catch(error){

        console.log(`Error fetching conversation message: ${error}`);
        
        return res.status(503).json({
            msg: "Internal server error."
        })
    }

}