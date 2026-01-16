import mongoose,{Schema} from "mongoose"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema=new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true, //remove leading and trailing spaces
        index:true //index on a field allowsfaster search
    },

    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true, //remove leading and trailing spaces
    },

    fullname:{
        type:String,
        required:true,
        unique:true,
        trim:true, 
        index:true 
    },

avatar:{
        type:String,   //cloudinary url -- where we upload videos and it gives url of that video
        required:true,
    },

    coverImaqge:{
        type:String,//cloudinary url
    },

    watchhistory:[{       
            type:Schema.Types.ObjectId,
            ref:"Video"
        }],

        password:{
            type:String,
            required:[true,'Password is required'], //in case pwd is wrong then show this message
        },
        refreshToken:{
            type:String,
    }
},{timestamps:true}) //automatically adds createdAt and updatedAt fields to schema



userSchema.pre("save", async function(next) {
    if(this.isModified("password"))
    this.password=bcrypt.hash(this.password,10)
         next();
}) 

userSchema.methods.isPasswordCorrect=async function(password){
    bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken=function(){
    jwt.sign({
        _id:this.id,
        username:this.username,
        email:this.email,
        fullname:this.fullname
    },
    process.env.ACCESS_TOKEN_SECRET, 
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign({
        _id:this.id,
    },
    process.env.REFRESH_TOKEN_SECRET, 
    {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User=mongoose.model("User", userSchema); 