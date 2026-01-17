import dotenv from "dotenv"; 
 dotenv.config();  //loads all environemt varibales from .env file into process.env


 //when we did this inside index.js,it was not working in other files bcz all imports are done first in NODE. So other things were imported first before setting env variables.
 
 //So cloudinary_api_key,etc remained empty.