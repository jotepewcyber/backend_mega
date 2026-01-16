// require("dotenv").config();   one way
import dotenv from "dotenv"; 
import mongoose from "mongoose";
import {DB_NAME} from "./constants.js";
import {app} from "./app.js";
import connectDB from "./db/index.js";

dotenv.config();  //loads all environemt varibales from .env file into process.env
const PORT=process.env.PORT || 8000;
connectDB()
.then(()=>{
    app.on("error",(error)=>{
console.log("ERROR:" ,error)
 throw error;
}) 
    app.listen(PORT,()=>{
        console.log(`App is listening on PORT ${PORT}`);
    })
})
.catch((err)=>{
    console.error("DB connection failed", err);
})

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