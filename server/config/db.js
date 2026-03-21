import mongoose from "mongoose";
 
//connection to MongoDB
const connectDB= async()=>{
try {
    const connecting = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDb connected :${connecting.connection.host}`)
} catch (error) {
    process.exit(1)
    
}    
}
export default connectDB;