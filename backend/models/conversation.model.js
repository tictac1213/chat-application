import  mongoose, { Schema } from 'mongoose';


const conversationSchema = new Schema({
    name: {
        type: String
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    lastMessage:{
        content: String,
        senderId: {  
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        messageType: String,
        createdAt: Date
    },
    type: {
        type: String,
        enum: ['dm','group'],
        default: 'dm',
        required: true
    }
},
{
    timestamps: true
});

conversationSchema.index({updatedAt: -1});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;