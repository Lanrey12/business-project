import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "https://th.bing.com/th?id=OIP.eCrcK2BiqwBGE1naWwK3UwHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&pid=3.1&rm=2"
    }

}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;