import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import  {uploadOnCloudinary} from "../utils/Cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

//if error would have been there thenit would have been caught in asyncHandler, not here 
const registerUser=asyncHandler(
    async(req,res)=>{
//get user details from frontend

const {fullname,email,username,password}=req.body





//validation if details sent by user are valid
if(fullname == "" || username == "" || password == "")
{
    throw new ApiError(400,"All Fields are required");
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(emailRegex.test(email) === false) {
  throw new ApiError(400,"Enter proper email address");
}




//check if user already exists;check by username,email
const existeduser=await User.findOne({
    //.findOne is asynchronous-->so it returns promise.
    //Without resolving the promise, existeduser will always be true
    $or:[{username},{email}]
})
if(existeduser){
    throw new ApiError(409,"User with given username/email already exists");
}




//check if files are there (ie. avatar and coverImage) 
const avatarlocalPath=req.files?.avatar?.[0]?.path;
//.files is given by multer middleware
//returns path of file in local system where multer stored it temporarily
const coverImagelocalPath=req.files?.coverImage?.[0]?.path;
  
if(!avatarlocalPath ){
throw new ApiError(400,"Avatar is required")
}



//upload them to cloudinary
 const avatar=await uploadOnCloudinary(avatarlocalPath)
 const coverImage=await uploadOnCloudinary(coverImagelocalPath)

 if(!avatar){
    throw new ApiError(500,"Error while uploading avatar image");
 }
 if(!coverImage){
    console.log("Error while uploading cover image");
 }
 







 //create user object -- create entry in db

const user = await User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url || "",
    email,
    password,
    username:username.toLowerCase() 
})







//remove pwd and refresh token field from response bcz we dont want to give it to frontend user
const createdUser=await User.findById(user._id).
select("-password -refreshToken")
//syntax to remove pwd and refreshtoken from user

//check for user creation
if(!createdUser) throw new ApiError(500,"Something went wrong while registering user")









//return response to frontend
return res.status(201).json(
    new ApiResponse(200,createdUser,"User registered Successfully")
)





    }
)


const generateAccessandrefreshToken=async(userId)=>{
    try{
const user=await User.findById(userId);
const accesstoken=await user.generateAccessToken()
const refreshtoken=await user.generateRefreshToken()

user.refreshToken=refreshtoken
await user.save({validateBeforeSave:false}) //bcz we are not updating all fields

return {accesstoken,refreshtoken};
    }
    catch(error){
throw new ApiError(500,"Error while generating access token")
    }
}

const loginUser=asyncHandler( async(req,res)=>{
    //take username and password from req.body
const {username,email,password}=req.body;

    //validate them 
    if(!username && !email){
        throw new ApiError(400,"Username OR Email is required");
    }

const user=await User.findOne({
    $or:[{username},{email}]
})
if(!user){
    throw new ApiError(404,"User does not exist");
}


const isPasswordValid= await user.isPasswordCorrect(password)
if(!isPasswordValid){
    throw new ApiError(401,"Invalid user credentials");
}


//generate access & refresh token 
const {accesstoken,refreshtoken}=await generateAccessandrefreshToken(user._id);

const loggedInUser=await User.findById(user._id).select("-password -refreshToken")


//put that refresh token in user's browser by cookies
const options={
    httpOnly:true,
    secure:true  //cookies now become modifiable only by server not from browser els ecookies are default secure false}
}

return res
.status(200)
.cookie("accesstoken",accesstoken,options)
.cookie("refreshToken",refreshtoken,options)
//it sets a cookie with name refreshtoken and value accesstoken
.json(
    new ApiResponse(200,
        {user:loggedInUser,accesstoken,refreshtoken},
        "User logged in successfully")
    )



})
   

//remove refresh,access token from browser and DB
    //PROBLEM--> how to identify which user is logging out; ie.how to get his ID

const logoutUser=asyncHandler(async (req,res)=>{
     
    await User.findByIdAndUpdate(req.user._id,{
$set:{
    refreshToken:undefined,
}
    },
{
    new:true
},
    )

    const options={
        httpOnly:true,
        secure:true
    }
return res
.status(200)
.clearCookie("accesstoken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200,{},"User logged out successfully"))

})


const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies?.refreshToken || req.body.refreshToken

    if(!incomingRefreshToken){
        throw new ApiError(401,"refresh Token is missing!!! Unauthorized request")
    }

    //verify incoming refresh token
   try {
    const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
 
    const user=await User.findById(decodedToken?._id)
 
    if(!user){
     throw new ApiError(401,"Invalid refresh Token...Can't verify you")
    }
 
    if(incomingRefreshToken !== user?.refreshToken){
     throw new ApiError(401,"Refresh Token is invalid/expired")
    }
 
    //if refresh token is valid, generate new access and refresh token
    const options={
     httpOnly:true,
     secure:true
    }
 
  const{accesstoken,newRefreshtoken}= await generateAccessandrefreshToken(user._id)
 
   return res
   .status(200)
   .cookie("accesstoken",accesstoken,options)
   .cookie("refreshToken",newRefreshtoken,options)
   .json(
     new ApiResponse(200,
         {accesstoken, newRefreshtoken},
         "Access Token refreshed successfully"
     )
   )
   } catch (error) {
    throw new ApiError(401,error.message || "Invalid refresh Token")
   }
})

export {registerUser, loginUser,logoutUser,refreshAccessToken}