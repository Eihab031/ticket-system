import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
//Creating player Model with a default player Role 
const userSchema= new mongoose.Schema({
    fullName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required:true,
        minLength:6,
    },
    role:{
        type:String,
        required:true,
        enum:['player','admin'],
        defualt:'player'
    }
},{timestamps:true});
// Encrypting User's Password before saving to DataBase 
userSchema.pre("save",async function(next){
    if(!this.isModified('password')) return;
    try {
        const salt= await bcrypt.genSalt(10);
        this.password= await bcrypt.hash(this.password,salt)
    } catch (error) {
        throw new Error(error)
    }
})
const User= new mongoose.model("User",userSchema);
export default User;