import mongoose from "mongoose";
import {DB_NAME} from "../constants.js";

const connectDB=async()=>{
    try{
const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

console.log(`\n MongoDB connected !!!! DB HOST:${connectionInstance.connection.host} \n`);
//from the returned object we are accessing connection property and from that we are accessing to which host connection is made
    }
    catch(err){
        console.error("Error in DB connection", err);
        process.exit(1)
    }
}

export default connectDB;