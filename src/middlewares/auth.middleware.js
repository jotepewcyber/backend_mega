import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { loginUser,logoutUser } from "../controllers/user.controller.js"




export const verifyJWT= asyncHandler(async(req,res,next)=>{
   try {
     const token=req.cookies?.accesstoken || req.header("Authorization").replace("Bearer ","")
     //req.header so that if token comes from header instead of main body
 
     if(!token){
         throw new ApiError(401,"Unauthorized request, token missing")
     }
 
     
         //verify token is correct
         const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
         //it verifies token and gives decoded payload
 
         //bcz in signing we gave _id of user,so when we decode the token from header/request, it gives _if of user.
     const user=await User.findById(decodedToken?._id).select("-password -refreshToken")
 
     if(!user){
         throw new ApiError(401,"Unauthorized request, user not found")
     }
 
     //in request object, we are adding this user so we can get _id in future for maintainig sessions
     req.user=user
     next();
     //this next is used in user.routes.js -->there are 2 middlewarres used so it tells it to first execute 1st then also execute 2nd
   } catch (error) {
    throw new ApiError(401,error?.message || "Unauthorized request, invalid token")
   }
}) 