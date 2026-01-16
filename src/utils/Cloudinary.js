//we supposed we get the files from our server.Now in this we need to upload it to Cloudinary
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


  cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    

    const uploadOnCloudinary = async(localFilePath)=>{
        try{
            //if the didnt exist in our server
if(!localFilePath) return null;
//else upload file to cloudinary

const response=await cloudinary.uploader
       .upload(localFilePath, {
              resource_type:"auto", //automatically detect type of file, img,video,etc,
           }
       )

       console.log("File uploaded on cloudinary successfully",response.url)
       return response;
       //this response has multiple fields like response.url,public_id,color,created_at,etc
}

        
        catch(err){
            //if we reached here, then file is present in our server
            //so delete that file ie. unlink
            fs.unlinkSync(localFilePath);
            console.error("Error while uploading on cloudinary", err);
            return null;
            
            
        }
    }






       
    export {uploadOnCloudinary};