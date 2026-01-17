import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app=express();


app.use(cors(
    {
        origin:process.env.CORS_ORIGIN,
        credentials:true
    }
));

app.use(express.json({limit:"1600kb"})); //middleware to set jon content max size to 16kb
app.use(express.urlencoded({limit:"1600kb"})); //get same data irrespective of encoding used in url
app.use(express.static("public")); //middleware to let browser access static files like images,etc directly from public folder
app.use(cookieParser()); //middleware to let server read cookies from user's browser
//now we can get req.cookies,res.cookies


//importing routes
import userRouter from "./routes/user.routes.js";

//routes declaration
app.use("/api/v1/users",userRouter)



export {app};