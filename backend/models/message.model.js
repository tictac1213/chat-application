import { mongoose, Schema } from 'mongoose';

const messageSchema = new Schema({

    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        trim: true,
        maxlength: 4000,
    },
    conversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        index: true
    },
    type: {
        type: String,
        enum: ['text','img','file'],
        default: 'text'
    },
    seenBy: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
},
{
    timestamps: true
});

messageSchema.index({ conversationId: 1, createdAt: -1});

messageSchema.index({senderId: 1})

const Message = mongoose.model('Message', messageSchema);

export default Message;