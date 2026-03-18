
import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js"



export async function createConversation(req, res){

    try {
        
        const conversation = req.body;
        if (!conversation.members || conversation.members.length < 1 ) {
            return res.status(400).json({ 
                msg: "Invalid members" 
            });
        }
        const allMembers = [...conversation.members, req.user.id.toString()];


        if( conversation.members.length === 2 ){
            // dm
            const existing = await Conversation.findOne({
                type: "dm", 
                members: {$all: allMembers}
            })

            if(existing){
                return res.status(200).json({
                    success: true,
                    conversation: existing
                })
            }

            const newConversation = await Conversation.create({
                type: 'dm',
                members: allMembers
            });

            return res.status(201).json({
                success:true,
                conversation: newConversation
            })
        }
        else{
            // group
            const existing = await Conversation.findOne({
                name: conversation.name, 
                members: {$all: allMembers}
            })

            if(existing){
                return res.status(201).json({
                    success: true,
                    existing
                })
            }

            const newConversation = await Conversation.create({
                name: conversation.name,
                type: 'group',
                members: allMembers
            });

            return res.status(201).json({
                success:true,
                newConversation
            })

        }

    } 
    catch (error) {
        
        console.log(`Error creating conversationr: ${error}`);

        return res.status(503).json({
            msg: "Internal server error."
        })
    }
}


export async function searchConversation(req, res){
    try {
        
        let { search } = req.query;
        const user = req.user;

        
        if(!search || search.trim().length < 2){
            return res.status(400).json({
                msg: "Insufficient prefix."
            })
        }
        
        search = search.trim();
        console.log(search);
        console.log(user.id);
        
    
        const results1 = await Conversation.find({
            name: {$regex: `^${search}`, $options: 'i' },
            members: user.id
        }).limit(5).select("name _id");
        
        const results2 = await User.find({
            username: {$regex: `^${search}`, $options: 'i' },
            _id: {$nin : [user.id]}
        }).limit(5).select("username _id");

        // console.log(results2);
        

        return res.status(200).json({
            success: true,
            conversations: results1, 
            users: results2
        });
            
    } 
    catch (error) {
        
        console.log(`Error searching conversation: ${error}`);

        return res.status(503).json({
            msg: "Internal server error."
        })
    }
}

export async function getUserConversations(req, res){
    
    try {
        const user = req.user;
        
        const conversations = await Conversation.find({
            members: user.id
        })
        .limit(20)
        .select('name _id members type lastMessage')
        .sort({ updatedAt: -1 })
        .populate("lastMessage.senderId", "username")
        .populate("members", "username");
        const result = await Promise.all(conversations.map(async (conv) => {
            if(conv.type === 'dm'){
                const other = conv.members.find(m => m._id.toString() !== user.id);
            

                return {
                    ...conv.toObject(),
                    name: other.username
                }

            }
            return conv;
        }));
        return res.status(200).json({
            conversations: result
        })

    } 
    catch (error) {
        
        console.log(`Error fetching user conversation: ${error}`);

            return res.status(503).json({
                msg: "Internal server error."
            })
        }
    
}