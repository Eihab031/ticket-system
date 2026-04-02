import mongoose from "mongoose";

const messageSchema= new mongoose.Schema({
    ticket:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Ticket", // link to Ticket model
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User", // link to User model
    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false,
    },
    body:{
        type:String,
        required:[true,"Message can't be empty"],
        trim:true,
    },
},{timestamps:true});

const Message= mongoose.model('Message',messageSchema);

export default Message;