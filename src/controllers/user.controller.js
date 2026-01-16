import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import  {uploadOnCloudinary} from "../utils/Cloudinary.js";

//if error would have been there thenit would have been caught in asyncHandler, not here 
const registerUser=asyncHandler(
    async(req,res)=>{
//get user details from frontend
const {fullname,email,username,password}=req.body
console.log("email:", email);





//validation if details sent by user are valid
if(fullname == "" || username == "" || password == "")
{
    throw new ApiError(400,"All Fields are required");
}
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(emailRegex.test(email) === false) {
  alert("Enter proper email address");
}




//check if user already exists;check by username,email
const existeduser=User.findOne({
    $or:[{username},{email}]
})
if(existeduser){
    throw new ApiError(409,"User with given username/email already exists");
}




//check if files are there (ie. avatar and coverImage) 
const avatarlocalPath=req.files?.avatar[0]?.path;
//.files is given by multer middleware
//returns path of file in local system where multer stored it temporarily
const coverImagelocalPath=req.files?.coverImage[0]?.path;
 
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

User.create({
    fullname,
    avatar:avatar.url,
    coverImage:coverImage?.url,
})










//remove pwd and refresh token field from response bcz we dont want to give it to frontend user

//check for user creation

//return response to frontend
    }
)


export {registerUser}