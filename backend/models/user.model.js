import { mongoose, Schema } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        trim: true,
        index: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        index: true,
        trim: true
    },
    password: {
        type: String,
        select: false
    },
    provider:{
        type: String,
        enum: ["local", "google", "github"],
        default: "local",
        index: true
    },
    providerId: {
        type: String,
        sparse: true,
        unique: true
    }
},
{
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;