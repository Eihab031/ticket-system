import mongoose from 'mongoose'

const ticketSchema= mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'  // referencing to User model
    },
    issue_type:{
        type: String,
        required: [true,'please select an Issue'],
        enum:['web App','Mobile App','Billing','General Inquiry'],
    },
    title:{
        type:String,
        required:[true,'please enter a subject for the Ticket'],
        trim:true,
        maxlength:[100,"title can't be more than 100 characters "]
    },
    description:{
        type:String,
        required:[true,'please descripe the issue']
    },
    status:{
        type:String,
        required:true,
        enum:['new','open','closed'],
        default:'new',
    }
},{timestamps:true})

const Ticket= new mongoose.model('ticket',ticketSchema);
export default Ticket;