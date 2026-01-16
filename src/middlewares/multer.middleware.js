import multer from "multer";



const storage = multer.diskStorage(
//takes 2 items destination(where file shall be saved), filename(file name to be given)
//cb--> callback
    {
        //we get req from express when HTTP request comes to our server
        //file is the file being uploaded for taking this file we are using multer
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  //if no destination is given, multer uses temporary storage folder of OS to save files
  filename: function (req, file, cb) {
    
    cb(null, file.originalname)
    //functionality upgrade here: to avoid name clash, we can add timestamp to original name
  //  though file remains here for very tiny millisecind then we upload it to cloudinary
  }
})

export const upload = multer({ storage: storage })