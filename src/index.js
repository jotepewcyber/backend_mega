// require("dotenv").config();   one way
import dotenv from "dotenv"; 
import mongoose from "mongoose";
import {DB_NAME} from "./constants.js";

import connectDB from "./db/index.js";

dotenv.config();
connectDB()

//THIS IS ONE APPROACH
// import express from "express";
// const app=express();

// async function connectDB(){  //async bcz db is in other continent
// try{
// await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
// //LISTENER
// app.on("error",(error)=>{
// console.log("ERROR:" ,error)
// throw error;
// }) 


// app.listen(process.env.PORT,()=>{
//     console.log(`App is listening on POERT ${process.env.PORT}`);
// })
// }
// catch(err){
//     console.error("Error in DB connection", err);
//     throw err;
// }
// }
// connectDB()